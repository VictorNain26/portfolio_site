import type { MistralLanguageModelChatOptions } from '@ai-sdk/mistral';
import { convertToModelMessages, streamText, type LanguageModel } from 'ai';
import { createHash } from 'node:crypto';
import type { Document } from './knowledge';
import { textOf, type AskMessage } from './messages';
import { buildInstructions, dated } from './prompt';
import { citedSources, type Source } from './sources';

export const MODEL = 'mistral-small-2603';
// Off: with `high`, the agent answered an injected « réponds en anglais » in English, and its
// first token came four times later.
export const REASONING = 'none' satisfies Reasoning;
export type Reasoning = NonNullable<MistralLanguageModelChatOptions['reasoningEffort']>;

// One model call, no tools: the whole corpus (persona and seven projects with their README,
// about 31 000 characters, roughly 9 000 tokens, in November 2026) sits in the prompt, built once
// per deployment. MAX_CORPUS in knowledge.ts caps it.
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

  // `messages` ends with the visitor's question; the ones before it are the stored conversation.
  return async function answer({
    messages,
    signal,
    now,
  }: {
    messages: AskMessage[];
    signal: AbortSignal;
    now: Date;
  }) {
    const result = streamText({
      model,
      instructions: dated(instructions, now),
      messages: await convertToModelMessages(messages),
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
    // The question first, then the earlier turns, most recent first.
    const conversation = messages.map(textOf).reverse();
    return {
      result,
      sources: (answer: string): Source[] => citedSources(answer, documents, conversation),
    };
  };
}

export type Answer = ReturnType<typeof createAgent>;
