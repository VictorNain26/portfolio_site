import { z } from 'astro/zod';

const MODERATION_MODEL = 'mistral-moderation-2603';
const ENDPOINT = 'https://api.mistral.ai/v1/chat/moderations';

// Mistral's policy lists dangerous and criminal content apart, while its response examples still
// show the older merged category: both are blocked.
// https://github.com/mistralai/platform-docs-public/blob/main/src/content/en/docs/studio/conversations/moderation/page.mdx
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

const responseSchema = z.object({
  results: z.array(z.object({ categories: z.record(z.string(), z.unknown()) })),
});

type Fetch = (url: string, init: RequestInit) => Promise<Response>;

// A plain call to the conversational moderation endpoint: the AI SDK has no moderation API.
export function createModeration({
  apiKey,
  fetch: post = fetch,
}: {
  apiKey: string;
  fetch?: Fetch;
}) {
  return async (question: string, signal: AbortSignal): Promise<boolean> => {
    const res = await post(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: MODERATION_MODEL,
        input: [{ role: 'user', content: question }],
      }),
      signal,
    });
    if (!res.ok) throw new Error(`moderation: ${res.status}`);
    const categories = responseSchema.parse(await res.json()).results[0]?.categories ?? {};
    // Only a strict true blocks: a field Mistral adds later must not fail or block every question.
    return BLOCKING.some(category => categories[category] === true);
  };
}
