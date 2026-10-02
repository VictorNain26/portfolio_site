import type { Mistral } from '@mistralai/mistralai';

export const MODERATION_MODEL = 'mistral-moderation-2603';

const BLOCKING = [
  'sexual',
  'hate_and_discrimination',
  'violence_and_threats',
  'dangerous',
  'criminal',
  'selfharm',
  'jailbreaking',
];

// The AI SDK has no moderation API: Mistral's own client classifies the question.
export function createModeration(client: Pick<Mistral, 'classifiers'>) {
  return async (question: string, signal: AbortSignal): Promise<boolean> => {
    const { results } = await client.classifiers.moderateChat(
      { model: MODERATION_MODEL, inputs: [{ role: 'user', content: question }] },
      { signal },
    );
    const categories = results[0]?.categories ?? {};
    return BLOCKING.some(category => categories[category]);
  };
}
