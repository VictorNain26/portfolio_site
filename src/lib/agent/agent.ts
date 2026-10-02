import type { MistralLanguageModelChatOptions } from '@ai-sdk/mistral';
import { isStepCount, streamText, type LanguageModel, type ModelMessage } from 'ai';
import { createHash } from 'node:crypto';
import type { Activity } from './activity';
import type { Document, Knowledge } from './knowledge';
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

// Tool, tool, then the answer: the last step may not call a tool, so it always writes.
const MAX_STEPS = 3;

export function createAgent({
  model,
  knowledge,
  documents,
  activity,
  reasoning,
}: {
  model: LanguageModel;
  knowledge: Knowledge;
  documents: Document[];
  activity: () => Promise<Activity[]>;
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
    const instructions = buildSystemPrompt(knowledge, documents, now);
    // Mistral caches by shared prefix; the date closes the prompt, so the key leaves it out.
    const promptCacheKey = createHash('sha256')
      .update(instructions.slice(0, instructions.lastIndexOf('\n\n')))
      .digest('hex')
      .slice(0, 16);
    const messages: ModelMessage[] = [
      ...history.flatMap((turn): ModelMessage[] => [
        { role: 'user', content: turn.question },
        { role: 'assistant', content: turn.answer },
      ]),
      { role: 'user', content: question },
    ];
    const read: string[] = [];
    const result = streamText({
      model,
      instructions,
      messages,
      tools: createTools({ repos: knowledge.repos, activity, read }),
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
      telemetry: { functionId: 'ask' },
    });

    const toolOutputs: ToolOutput[] = [];
    async function* text() {
      for await (const part of result.stream) {
        // The model sets names in markdown bold despite the prompt; the page shows plain text,
        // and French prose has no use for an asterisk. Underscores stay: repo names carry them.
        if (part.type === 'text-delta') yield part.text.replaceAll('*', '');
        else if (part.type === 'tool-result')
          toolOutputs.push({ tool: part.toolName, output: part.output });
        else if (part.type === 'error') throw part.error;
      }
    }

    return { text: text(), sources: answer => citedSources(answer, documents, read), toolOutputs };
  };
}
