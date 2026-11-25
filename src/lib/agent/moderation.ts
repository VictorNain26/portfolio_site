import type { Mistral } from '@mistralai/mistralai';

const MODERATION_MODEL = 'mistral-moderation-2603';

// Mistral's policy lists dangerous and criminal content apart, while its response examples still
// show the older merged category: both are blocked.
// https://docs.mistral.ai/capabilities/guardrailing
const BLOCKING = [
  'sexual',
  'hate_and_discrimination',
  'violence_and_threats',
  'dangerous',
  'criminal',
  'dangerous_and_criminal_content',
  'selfharm',
  'jailbreaking',
];

// The AI SDK has no moderation API: Mistral's own SDK classifies the question as a chat turn.
export function createModeration(client: Pick<Mistral, 'classifiers'>) {
  return async (question: string, signal: AbortSignal): Promise<boolean> => {
    const { results } = await client.classifiers.moderateChat(
      { model: MODERATION_MODEL, inputs: [{ role: 'user', content: question }] },
      { signal },
    );
    const categories: Record<string, unknown> = results[0]?.categories ?? {};
    // Only a strict true blocks: a field Mistral adds later must not block every question.
    return BLOCKING.some(category => categories[category] === true);
  };
}
