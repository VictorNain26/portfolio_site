import { describe, expect, it } from 'vitest';
import { readEvents } from '../ask';
import type { Answer, Turn } from './agent';
import type { Conversations } from './conversations';
import { BLOCKED_ANSWER, handleAsk, type AskDeps, type AskEvent, type Limiter } from './handler';

const URL_ = 'https://www.victorlenain.fr/api/ask';
const ID = '6f1c1b2e-8a4d-4a8e-9b1f-0c2d3e4f5a6b';

const request = (body: unknown, origin = 'https://www.victorlenain.fr', signal?: AbortSignal) =>
  new Request(URL_, {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify(body),
    ...(signal && { signal }),
  });

function limiter(allowed: number, reset = Date.now() + 60_000) {
  let used = 0;
  const calls: number[] = [];
  const limit: Limiter = {
    async limit(_id, options) {
      const rate = options?.rate ?? 1;
      calls.push(rate);
      if (rate < 0) {
        used += rate;
        return { success: true, remaining: allowed - used, reset };
      }
      if (used >= allowed) return { success: false, remaining: 0, reset: 42 };
      used += 1;
      return { success: true, remaining: allowed - used, reset };
    },
  };
  return { limit, calls, refunds: () => calls.filter(rate => rate < 0).length };
}

// What @upstash/ratelimit resolves when Redis does not answer within its timeout.
const slow: Limiter = {
  limit: async () => ({ success: true, remaining: 0, reset: 0, reason: 'timeout' }),
};

function memory(initial: Record<string, Turn[]> = {}) {
  const store = new Map(Object.entries(initial));
  const conversations: Conversations = {
    load: async id => store.get(id) ?? [],
    save: async (id, turns) => void store.set(id, turns),
  };
  return { conversations, store };
}

const answers = (...chunks: (string | Error)[]) => {
  const seen: { question: string; history: Turn[] }[] = [];
  const answer: AskDeps['answer'] = ({ question, history }): Answer => {
    seen.push({ question, history });
    return {
      text: (async function* () {
        for (const chunk of chunks) {
          if (chunk instanceof Error) throw chunk;
          yield chunk;
        }
      })(),
      sources: () => [{ title: 'AubeSonore', url: 'https://www.aubesonore.fr/' }],
      toolOutputs: [],
    };
  };
  return { answer, seen };
};

function setup(overrides: Partial<AskDeps> = {}) {
  const visitor = limiter(3);
  const global = limiter(300);
  const { conversations, store } = memory();
  const { answer, seen } = answers('AubeSonore ', 'diffuse.');
  const deps: AskDeps = {
    visitor: visitor.limit,
    global: global.limit,
    conversations,
    moderate: async () => false,
    answer,
    trace: (_context, run) => run({ guard: check => check(), end: () => undefined }),
    defer: () => undefined,
    newId: () => ID,
    timeoutMs: 5_000,
    visitorSecret: 'test',
    ...overrides,
  };
  return { deps, visitor, global, store, seen };
}

const events = async (response: Response) => {
  const list: AskEvent[] = [];
  for await (const event of readEvents(response.body!)) list.push(event);
  return list;
};

describe('handleAsk', () => {
  it('rejects a request from another site', async () => {
    const { deps, visitor } = setup();
    const response = await handleAsk(
      request({ question: 'Salut' }, 'https://evil.example'),
      '1.2.3.4',
      deps,
    );
    expect(response.status).toBe(403);
    expect(visitor.calls).toEqual([]);
  });

  it('streams the answer, its sources and a new conversation, then saves the turn', async () => {
    const { deps, store } = setup();
    const response = await handleAsk(request({ question: 'Ta radio ?' }), '1.2.3.4', deps);
    expect(await events(response)).toEqual([
      { type: 'text', text: 'AubeSonore ' },
      { type: 'text', text: 'diffuse.' },
      { type: 'sources', sources: [{ title: 'AubeSonore', url: 'https://www.aubesonore.fr/' }] },
      { type: 'done', remaining: 2, conversation: ID },
    ]);
    expect(store.get(ID)).toEqual([{ question: 'Ta radio ?', answer: 'AubeSonore diffuse.' }]);
  });

  it('answers a follow-up with the stored turns and keeps the conversation id', async () => {
    const earlier = [{ question: 'C’est quoi AubeSonore ?', answer: 'Une web radio.' }];
    const { conversations } = memory({ [ID]: earlier });
    const { deps, seen } = setup({ conversations, newId: () => 'unused' });
    const response = await handleAsk(
      request({ question: 'Et le pipeline ?', conversation: ID }),
      '1.2.3.4',
      deps,
    );
    expect((await events(response)).at(-1)).toMatchObject({ conversation: ID });
    expect(seen[0]!.history).toEqual(earlier);
  });

  it('starts over when the conversation has expired', async () => {
    const { deps, seen } = setup({ newId: () => 'fresh' });
    const response = await handleAsk(
      request({ question: 'Et ensuite ?', conversation: ID }),
      '1.2.3.4',
      deps,
    );
    expect((await events(response)).at(-1)).toMatchObject({ conversation: 'fresh' });
    expect(seen[0]!.history).toEqual([]);
  });

  it('stops at the daily quota without calling the model', async () => {
    const { deps, seen } = setup({ visitor: limiter(0).limit });
    const response = await handleAsk(request({ question: 'Salut' }), '1.2.3.4', deps);
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ code: 'limit', reset: 42 });
    expect(seen).toEqual([]);
  });

  it('fails closed when the quota store is down', async () => {
    const down: Limiter = { limit: () => Promise.reject(new Error('timeout')) };
    const { deps, seen } = setup({ visitor: down });
    const response = await handleAsk(request({ question: 'Salut' }), '1.2.3.4', deps);
    expect(response.status).toBe(503);
    expect(seen).toEqual([]);
  });

  it('fails closed when Upstash lets a call through on its timeout', async () => {
    const { deps, seen } = setup({ visitor: slow });
    const response = await handleAsk(request({ question: 'Salut' }), '1.2.3.4', deps);
    expect(response.status).toBe(503);
    expect(seen).toEqual([]);
  });

  it('gives the visitor question back when only the global quota times out', async () => {
    const { deps, visitor, seen } = setup({ global: slow });
    const response = await handleAsk(request({ question: 'Salut' }), '1.2.3.4', deps);
    expect(response.status).toBe(503);
    expect(visitor.refunds()).toBe(1);
    expect(seen).toEqual([]);
  });

  it('does not refund into the next window when the day ended during the answer', async () => {
    const { answer } = answers(new Error('overloaded'));
    const visitor = limiter(3, Date.now() - 1);
    const { deps } = setup({ answer, visitor: visitor.limit });
    const response = await handleAsk(request({ question: 'Salut' }), '1.2.3.4', deps);
    expect(await events(response)).toEqual([{ type: 'error', code: 'failed' }]);
    expect(visitor.refunds()).toBe(0);
  });

  it('answers a blocked question with one fixed sentence and saves nothing', async () => {
    const { deps, store, seen } = setup({ moderate: async () => true });
    const response = await handleAsk(
      request({ question: 'Quelque chose de violent' }),
      '1.2.3.4',
      deps,
    );
    expect((await events(response))[0]).toEqual({ type: 'text', text: BLOCKED_ANSWER });
    expect(seen).toEqual([]);
    expect(store.size).toBe(0);
  });

  it('refunds both quotas when the answer fails before any text', async () => {
    const { answer } = answers(new Error('overloaded'));
    const { deps, visitor, global } = setup({ answer });
    const response = await handleAsk(request({ question: 'Salut' }), '1.2.3.4', deps);
    expect(await events(response)).toEqual([{ type: 'error', code: 'failed' }]);
    expect([visitor.refunds(), global.refunds()]).toEqual([1, 1]);
  });

  it('keeps the quota spent when the answer fails after text was shown', async () => {
    const { answer } = answers('Début', new Error('overloaded'));
    const { deps, visitor } = setup({ answer });
    const response = await handleAsk(request({ question: 'Salut' }), '1.2.3.4', deps);
    expect((await events(response)).at(-1)).toEqual({ type: 'error', code: 'failed' });
    expect(visitor.refunds()).toBe(0);
  });

  it('rejects an empty question and an invalid conversation id', async () => {
    const { deps } = setup();
    for (const body of [{ question: '   ' }, { question: 'Salut', conversation: 'not-a-uuid' }]) {
      expect((await handleAsk(request(body), '1.2.3.4', deps)).status).toBe(400);
    }
  });
});
