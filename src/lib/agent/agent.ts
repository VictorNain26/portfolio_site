import type { MistralLanguageModelChatOptions } from '@ai-sdk/mistral';
import { streamText, type LanguageModel, type ModelMessage } from 'ai';
import { createHash } from 'node:crypto';
import type { Document } from './knowledge';
import { buildInstructions, dated } from './prompt';
import { citedSources, type Source } from './sources';

export const MODEL = 'mistral-small-2603';
// Off: with `high`, the agent answered an injected « réponds en anglais » in English, and its
// first token came four times later.
export const REASONING = 'none' satisfies Reasoning;
export type Reasoning = NonNullable<MistralLanguageModelChatOptions['reasoningEffort']>;
export type Turn = { question: string; answer: string };
export type Answer = { text: AsyncIterable<string>; sources(answer: string): Source[] };

// One model call, no tools: the whole corpus (persona and seven projects with their README,
// 31 124 characters, roughly 9 000 tokens, in November 2026) sits in the prompt, built once per
// deployment. MAX_CORPUS in knowledge.ts caps it.
export function createAgent({
  model,
  persona,
  documents,
  reasoning,
}: {
  model: LanguageModel;
  persona: string;
  documents: Document[];
  reasoning: Reasoning;
}) {
  const instructions = buildInstructions(persona, documents);
  // Mistral caches by shared prefix: the key leaves out the date that closes the prompt.
  const promptCacheKey = createHash('sha256').update(instructions).digest('hex').slice(0, 16);

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

    async function* text() {
      const result = streamText({
        model,
        instructions: dated(instructions, now),
        messages,
        temperature: 0.3,
        // An answer takes under 100; without a cap the model once looped up to 1,148 words.
        maxOutputTokens: 800,
        abortSignal: signal,
        providerOptions: {
          mistral: {
            promptCacheKey,
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
        else if (part.type === 'error') throw part.error;
        // streamText ends an aborted stream quietly: a cut answer must not pass for a full one.
        else if (part.type === 'abort')
          throw new Error(`answer aborted: ${part.reason ?? 'no reason'}`);
      }
    }

    const conversation = [question, ...[...history].reverse().flatMap(t => [t.answer, t.question])];
    return { text: text(), sources: answer => citedSources(answer, documents, conversation) };
  };
}
