import type { Mistral } from '@mistralai/mistralai';
import { describe, expect, it, vi } from 'vitest';
import { createModeration } from './moderation';

type Classifiers = Pick<Mistral, 'classifiers'>;
const open = new AbortController().signal;

const client = (categories: Record<string, unknown>) => {
  const moderateChat = vi.fn(async () => ({ id: 'm', model: 'x', results: [{ categories }] }));
  return { moderateChat, client: { classifiers: { moderateChat } } as unknown as Classifiers };
};

describe('createModeration', () => {
  it('asks Mistral to classify the question as a chat turn, with the request signal', async () => {
    const { moderateChat, client: mistral } = client({ sexual: false });
    await createModeration(mistral)('Ta radio ?', open);
    expect(moderateChat).toHaveBeenCalledWith(
      { model: 'mistral-moderation-2603', inputs: [{ role: 'user', content: 'Ta radio ?' }] },
      { signal: open },
    );
  });

  it('blocks a question flagged in a blocking category, not in another', async () => {
    const moderate = (categories: Record<string, boolean>) =>
      createModeration(client(categories).client)('q', open);
    expect(await moderate({ jailbreaking: true })).toBe(true);
    expect(await moderate({ dangerous_and_criminal_content: true })).toBe(true);
    expect(await moderate({ financial: true, pii: true })).toBe(false);
  });

  it('reads only true as a flag, whatever else a category carries', async () => {
    const moderate = createModeration(
      client({ jailbreaking: 'true', sexual: 1, extra: { score: 0.9 } }).client,
    );
    expect(await moderate('q', open)).toBe(false);
  });

  it('lets a failed call throw, so the handler can log it', async () => {
    const failing = {
      classifiers: { moderateChat: async () => Promise.reject(new Error('429')) },
    } as unknown as Classifiers;
    await expect(createModeration(failing)('q', open)).rejects.toThrow('429');
  });
});
