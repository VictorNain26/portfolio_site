import { describe, expect, it, vi } from 'vitest';
import { createModeration } from './moderation';

const verdict = (categories: Record<string, boolean>) =>
  new Response(JSON.stringify({ results: [{ categories }] }), { status: 200 });
const open = new AbortController().signal;

describe('createModeration', () => {
  it('asks Mistral to classify the question as a chat turn', async () => {
    const fetch = vi.fn(async () => verdict({ sexual: false }));
    await createModeration({ apiKey: 'k3y', fetch })('Ta radio ?', open);
    const [url, init] = fetch.mock.calls[0]! as unknown as [string, RequestInit];
    expect(url).toBe('https://api.mistral.ai/v1/chat/moderations');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer k3y');
    expect(JSON.parse(String(init.body))).toEqual({
      model: 'mistral-moderation-2603',
      input: [{ role: 'user', content: 'Ta radio ?' }],
    });
  });

  it('blocks a question flagged in a blocking category, not in another', async () => {
    const moderate = (categories: Record<string, boolean>) =>
      createModeration({ apiKey: 'k', fetch: async () => verdict(categories) })('q', open);
    expect(await moderate({ jailbreaking: true })).toBe(true);
    expect(await moderate({ dangerous_and_criminal_content: true })).toBe(true);
    expect(await moderate({ financial: true, pii: true })).toBe(false);
  });

  it('throws when Mistral fails, so the handler can log it', async () => {
    const moderation = createModeration({
      apiKey: 'k',
      fetch: async () => new Response('busy', { status: 429 }),
    });
    await expect(moderation('q', open)).rejects.toThrow('moderation: 429');
  });
});
