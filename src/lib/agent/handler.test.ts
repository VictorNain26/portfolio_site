import type { LanguageModelV4StreamPart } from '@ai-sdk/provider';
import { parseJsonEventStream, uiMessageChunkSchema, type UIMessageChunk } from 'ai';
import { convertArrayToReadableStream, MockLanguageModelV4 } from 'ai/test';
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { createAgent } from './agent';
import { redisConversations } from './conversations';
import { BLOCKED_ANSWER, FAILED, handleAsk, type AskDeps, type Limiter } from './handler';
import type { Document } from './knowledge';
import type { AskMessage } from './messages';

const URL_ = 'https://www.victorlenain.fr/api/ask';
const CHAT = 'chat-1';

const usage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 5, text: 5, reasoning: 0 },
};
const says = (...chunks: string[]) => ({
  stream: convertArrayToReadableStream<LanguageModelV4StreamPart>([
    { type: 'text-start', id: 't' },
    ...chunks.map(delta => ({ type: 'text-delta' as const, id: 't', delta })),
    { type: 'text-end', id: 't' },
    { type: 'finish', usage, finishReason: { unified: 'stop', raw: 'stop' } },
  ]),
});

const documents: Document[] = [
  {
    id: 'project:aubesonore',
    title: 'AubeSonore',
    url: 'https://www.aubesonore.fr/',
    names: ['AubeSonore', 'aubesonore'],
    text: 'AubeSonore : web radio diffusée via AzuraCast.',
  },
];

// What useChat's DefaultChatTransport posts once prepareSendMessagesRequest keeps the last message.
const request = (
  text: string,
  {
    origin = 'https://www.victorlenain.fr',
    id = CHAT,
    signal,
  }: { origin?: string; id?: string; signal?: AbortSignal } = {},
) =>
  new Request(URL_, {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify({
      id,
      message: { id: 'client-id', role: 'user', parts: [{ type: 'text', text }] },
    }),
    ...(signal && { signal }),
  });

function limiter(allowed: number, reset = Date.now() + 60_000) {
  let used = 0;
  const limit: Limiter = {
    async limit() {
      if (used >= allowed) return { success: false, remaining: 0, reset: 42 };
      used += 1;
      return { success: true, remaining: allowed - used, reset };
    },
  };
  return { limit, reset, used: () => used };
}

// The two Redis calls the conversation store makes, kept in memory.
function memoryRedis(initial: Record<string, unknown> = {}) {
  const store = new Map<string, unknown>(Object.entries(initial));
  const redis = {
    get: async (key: string) => (store.get(key) ?? null) as never,
    set: async (key: string, value: unknown) => {
      store.set(key, value);
      return 'OK' as never;
    },
  };
  return { redis, store };
}

function setup(
  overrides: Partial<AskDeps> = {},
  model = new MockLanguageModelV4({ doStream: async () => says('AubeSonore ', 'diffuse.') }),
) {
  const visitor = limiter(3);
  const global = limiter(300);
  const { redis, store } = memoryRedis();
  let ids = 0;
  const deps: AskDeps = {
    visitor: visitor.limit,
    global: global.limit,
    conversations: redisConversations(redis, 'ask:test:conversation'),
    isBot: async () => false,
    moderate: async () => false,
    answer: createAgent({
      model,
      persona: '## Qui je suis\n\n- Développeur.',
      documents,
      reasoning: 'none',
    }),
    trace: (_context, run) => run({ guard: check => check(), end: () => undefined }),
    defer: () => undefined,
    newId: () => `id-${++ids}`,
    timeoutMs: 5_000,
    visitorSecret: 'test',
    ...overrides,
  };
  return { deps, visitor, global, store, model };
}

const chunks = async (response: Response) => {
  const list: UIMessageChunk[] = [];
  const parsed = parseJsonEventStream({ stream: response.body!, schema: uiMessageChunkSchema });
  for await (const result of parsed) if (result.success) list.push(result.value);
  return list;
};
const text = (list: UIMessageChunk[]) =>
  list.flatMap(chunk => (chunk.type === 'text-delta' ? [chunk.delta] : [])).join('');
const stored = (store: Map<string, unknown>) =>
  store.get(`ask:test:conversation:${CHAT}`) as AskMessage[] | undefined;

describe('handleAsk', () => {
  let logged: MockInstance<typeof console.error>;
  beforeEach(() => {
    logged = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });
  afterEach(() => {
    logged.mockRestore();
  });

  it('rejects a request from another site before counting it', async () => {
    const { deps, visitor } = setup();
    const response = await handleAsk(
      request('Salut', { origin: 'https://evil.example' }),
      '1.2.3.4',
      deps,
    );
    expect(response.status).toBe(403);
    expect(visitor.used()).toBe(0);
  });

  it('refuses a request BotID classifies as a bot, before counting it', async () => {
    const { deps, visitor } = setup({ isBot: async () => true });
    const response = await handleAsk(request('Salut'), '1.2.3.4', deps);
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ code: 'bot' });
    expect(visitor.used()).toBe(0);
  });

  it('rejects an empty or oversized question, or a malformed chat id', async () => {
    const { deps } = setup();
    for (const req of [request('   '), request('x'.repeat(281)), request('Salut', { id: '../x' })])
      expect((await handleAsk(req, '1.2.3.4', deps)).status).toBe(400);
  });

  it('streams the quota, the answer and its sources as a UI message stream, then saves the turn', async () => {
    const { deps, store, visitor } = setup();
    const response = await handleAsk(request('Ta radio ?'), '1.2.3.4', deps);
    expect(response.headers.get('x-vercel-ai-ui-message-stream')).toBe('v1');
    const list = await chunks(response);
    expect(list[0]).toEqual({
      type: 'data-quota',
      data: { remaining: 2, reset: visitor.reset },
      transient: true,
    });
    expect(text(list)).toBe('AubeSonore diffuse.');
    expect(list.filter(chunk => chunk.type === 'source-url')).toEqual([
      {
        type: 'source-url',
        sourceId: 'https://www.aubesonore.fr/',
        url: 'https://www.aubesonore.fr/',
        title: 'AubeSonore',
      },
    ]);
    expect(list.at(-1)).toEqual({ type: 'finish' });
    const saved = stored(store)!;
    expect(saved.map(message => message.role)).toEqual(['user', 'assistant']);
    expect(saved[0]!.parts).toEqual([{ type: 'text', text: 'Ta radio ?' }]);
    // The ids are the server's, never the client's.
    expect(saved.map(message => message.id)).not.toContain('client-id');
    expect(saved[1]!.parts).toContainEqual(
      expect.objectContaining({ type: 'text', text: 'AubeSonore diffuse.' }),
    );
  });

  it('answers a follow-up with the stored conversation, never with history the visitor sends', async () => {
    const { deps, model } = setup();
    await chunks(await handleAsk(request('C’est quoi AubeSonore ?'), '1.2.3.4', deps));
    await chunks(await handleAsk(request('Et elle diffuse comment ?'), '1.2.3.4', deps));
    const prompt = model.doStreamCalls[1]!.prompt.filter(message => message.role !== 'system');
    expect(prompt.map(message => message.role)).toEqual(['user', 'assistant', 'user']);
    expect(JSON.stringify(prompt[0])).toContain('C’est quoi AubeSonore ?');
  });

  it('keeps only the last two turns', async () => {
    const { deps, store } = setup({ visitor: limiter(10).limit });
    for (const question of ['Un', 'Deux', 'Trois'])
      await chunks(await handleAsk(request(question), '1.2.3.4', deps));
    expect(
      stored(store)!
        .filter(message => message.role === 'user')
        .map(m => m.parts),
    ).toEqual([[{ type: 'text', text: 'Deux' }], [{ type: 'text', text: 'Trois' }]]);
  });

  it('starts over when the stored conversation is not valid UI messages', async () => {
    const { redis, store } = memoryRedis({
      [`ask:test:conversation:${CHAT}`]: [{ question: 'old' }],
    });
    const { deps, model } = setup({
      conversations: redisConversations(redis, 'ask:test:conversation'),
    });
    await chunks(await handleAsk(request('Ta radio ?'), '1.2.3.4', deps));
    expect(model.doStreamCalls[0]!.prompt.filter(message => message.role === 'user')).toHaveLength(
      1,
    );
    expect(stored(store)).toHaveLength(2);
  });

  it('answers a blocked question with the fixed sentence, without the model, and keeps it out of the conversation', async () => {
    const { deps, store, model } = setup({ moderate: async () => true });
    const list = await chunks(await handleAsk(request('…'), '1.2.3.4', deps));
    expect(text(list)).toBe(BLOCKED_ANSWER);
    expect(model.doStreamCalls).toHaveLength(0);
    expect(stored(store)).toBeUndefined();
  });

  it('refuses past the visitor quota, then past the global one', async () => {
    const { deps } = setup({ visitor: limiter(0).limit });
    const response = await handleAsk(request('Salut'), '1.2.3.4', deps);
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ code: 'limit', reset: 42 });
    const full = setup({ global: limiter(0).limit });
    expect((await handleAsk(request('Salut'), '1.2.3.4', full.deps)).status).toBe(429);
  });

  it('fails closed when the quota store fails or times out', async () => {
    const down: Limiter = { limit: async () => Promise.reject(new Error('redis down')) };
    const slow: Limiter = {
      limit: async () => ({ success: true, remaining: 0, reset: 0, reason: 'timeout' }),
    };
    for (const visitor of [down, slow])
      expect((await handleAsk(request('Salut'), '1.2.3.4', setup({ visitor }).deps)).status).toBe(
        503,
      );
  });

  it('counts a question whose answer fails, sends an error part and saves nothing', async () => {
    const failing = new MockLanguageModelV4({
      doStream: async () => {
        throw new Error('mistral down');
      },
    });
    const { deps, store, visitor } = setup({}, failing);
    const list = await chunks(await handleAsk(request('Ta radio ?'), '1.2.3.4', deps));
    expect(list).toContainEqual({ type: 'error', errorText: FAILED });
    expect(visitor.used()).toBe(1);
    expect(stored(store)).toBeUndefined();
    expect(logged).toHaveBeenCalledWith('ask: answer failed', expect.anything());
  });

  it('saves nothing when the visitor stops the answer', async () => {
    const { deps, store } = setup();
    const stop = new AbortController();
    stop.abort();
    const response = await handleAsk(
      request('Ta radio ?', { signal: stop.signal }),
      '1.2.3.4',
      deps,
    );
    const list = await chunks(response).catch(() => []);
    expect(list.some(chunk => chunk.type === 'finish')).toBe(false);
    expect(stored(store)).toBeUndefined();
  });

  it('keeps the function alive until the conversation is saved', async () => {
    let deferred: Promise<unknown> | undefined;
    const { deps } = setup({ defer: task => void (deferred = task) });
    await chunks(await handleAsk(request('Ta radio ?'), '1.2.3.4', deps));
    await expect(deferred).resolves.toBeUndefined();
  });
});
