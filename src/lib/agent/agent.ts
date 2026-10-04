import type { MistralLanguageModelChatOptions } from '@ai-sdk/mistral';
import { isStepCount, streamText, type LanguageModel, type ModelMessage } from 'ai';
import { createHash } from 'node:crypto';
import type { GitHub } from './github';
import { documentsOf, type Document, type Knowledge } from './knowledge';
import { buildSystemPrompt } from './prompt';
import { citedSources, type Source } from './sources';
import { createTools } from './tools';

export const MODEL = 'mistral-small-2603';
export type Reasoning = NonNullable<MistralLanguageModelChatOptions['reasoningEffort']>;
export type Turn = { question: string; answer: string };
export type ToolOutput = { tool: string; output: unknown };
export type Answer = {
  text: AsyncIterable<string>;
  sources(answer: string): Source[];
  // What the tools returned: the evaluation judge checks the answer against it too.
  toolOutputs: ToolOutput[];
};

// Up to three tool calls (search, then a README), then the answer: the last step may not
// call a tool, so it always writes.
const MAX_STEPS = 4;

export function createAgent({
  model,
  knowledge,
  github,
  publishedBy,
  siteUrl,
  reasoning,
}: {
  model: LanguageModel;
  knowledge: Knowledge;
  github: Pick<GitHub, 'repos' | 'readme' | 'search' | 'activity'>;
  // Posts scheduled after this date have no page yet: the agent must not know them.
  publishedBy: Date;
  siteUrl: string;
  reasoning: Reasoning;
}) {
  return function answer({
    question,
    history,
    signal,
    now,
  }: {
    question: string;
    history: Turn[];
    signal: AbortSignal;
    now: Date;
  }): Answer {
    const messages: ModelMessage[] = [
      ...history.flatMap((turn): ModelMessage[] => [
        { role: 'user', content: turn.question },
        { role: 'assistant', content: turn.answer },
      ]),
      { role: 'user', content: question },
    ];
    const read: string[] = [];
    const toolOutputs: ToolOutput[] = [];
    let documents: Document[] = [];

    async function* text() {
      // The repo list is live (cached), so a fresh push or a new repo needs no redeploy.
      const live: Knowledge = { ...knowledge, repos: await github.repos(signal) };
      documents = documentsOf(live, publishedBy, siteUrl);
      const instructions = buildSystemPrompt(live, documents, now);
      // Mistral caches by shared prefix; the date closes the prompt, so the key leaves it out.
      const promptCacheKey = createHash('sha256')
        .update(instructions.slice(0, instructions.lastIndexOf('\n\n')))
        .digest('hex')
        .slice(0, 16);
      const result = streamText({
        model,
        instructions,
        messages,
        tools: createTools({
          repos: live.repos,
          activity: github.activity,
          readme: github.readme,
          search: github.search,
          read,
          signal,
        }),
        stopWhen: isStepCount(MAX_STEPS),
        prepareStep: ({ stepNumber }) =>
          stepNumber === MAX_STEPS - 1 ? { toolChoice: 'none' } : undefined,
        temperature: 0.3,
        maxOutputTokens: 400,
        abortSignal: signal,
        providerOptions: {
          mistral: {
            promptCacheKey,
            parallelToolCalls: false,
            reasoningEffort: reasoning,
          } satisfies MistralLanguageModelChatOptions,
        },
        telemetry: { functionId: 'generate-answer' },
      });
      for await (const part of result.stream) {
        // The model sets names in markdown bold or code despite the prompt; the page shows plain
        // text, and French prose has no use for an asterisk or a backtick. Underscores stay:
        // repo names carry them. It also breaks lines to enumerate, though the answer is one line.
        if (part.type === 'text-delta')
          yield part.text.replace(/[*`]/g, '').replace(/\s*\n\s*/g, ' ');
        else if (part.type === 'tool-result')
          toolOutputs.push({ tool: part.toolName, output: part.output });
        else if (part.type === 'error') throw part.error;
        // streamText ends an aborted stream quietly: a cut answer must not pass for a full one.
        else if (part.type === 'abort')
          throw new Error(`answer aborted: ${part.reason ?? 'no reason'}`);
      }
    }

    return { text: text(), sources: answer => citedSources(answer, documents, read), toolOutputs };
  };
}
