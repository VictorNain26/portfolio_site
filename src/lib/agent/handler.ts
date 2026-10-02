import { z } from 'astro/zod';
import type { Answer, Turn } from './agent';
import type { Conversations } from './conversations';
import type { Source } from './sources';
import { visitorKey } from './visitor';

// `reset` ends the counted window; `reason: 'timeout'` is Upstash letting the call through
// when Redis is too slow to answer.
export type Limit = { success: boolean; remaining: number; reset: number; reason?: string };
export type Limiter = { limit(id: string, options?: { rate: number }): Promise<Limit> };

export type AskDeps = {
  visitor: Limiter;
  global: Limiter;
  conversations: Conversations;
  moderate(question: string, signal: AbortSignal): Promise<boolean>;
  answer(input: { question: string; history: Turn[]; signal: AbortSignal; now: Date }): Answer;
  // Runs the answer inside the trace of this conversation.
  trace<T>(conversation: string, run: () => Promise<T>): Promise<T>;
  // Keeps the function alive after the response for work that must not delay it.
  defer(task: Promise<unknown>): void;
  newId(): string;
  timeoutMs: number;
  visitorSecret: string;
};

export type AskEvent =
  | { type: 'text'; text: string }
  | { type: 'sources'; sources: Source[] }
  | { type: 'done'; remaining: number; conversation: string }
  | { type: 'error'; code: 'failed' };

export const BLOCKED_ANSWER = 'Je préfère ne pas répondre à ça.';
const GLOBAL_ID = 'global';

const bodySchema = z.object({
  question: z.string().trim().min(1).max(280),
  conversation: z.uuid().optional(),
});

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export async function handleAsk(
  request: Request,
  ip: string | undefined,
  deps: AskDeps,
): Promise<Response> {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    return json(403, { code: 'origin' });
  const key = ip === undefined ? undefined : visitorKey(ip, deps.visitorSecret);
  if (!key) return json(400, { code: 'ip' });
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json(400, { code: 'invalid' });
  const { question } = parsed.data;

  // A quota store that does not answer fails closed: no free questions while it is down.
  const limit = (limiter: Limiter, id: string) =>
    limiter
      .limit(id)
      .then(result => (result.reason === 'timeout' ? undefined : result))
      .catch(() => undefined);
  const visitor = await limit(deps.visitor, key);
  if (!visitor) return json(503, { code: 'failed' });
  if (!visitor.success) return json(429, { code: 'limit', reset: visitor.reset });
  const global = await limit(deps.global, GLOBAL_ID);
  // A refund after the window closed would land on the next one and give a free question.
  const giveBack = (limiter: Limiter, id: string, reset: number) =>
    Date.now() < reset ? limiter.limit(id, { rate: -1 }).catch(() => undefined) : undefined;
  const refundVisitor = () => giveBack(deps.visitor, key, visitor.reset);
  if (!global) {
    await refundVisitor();
    return json(503, { code: 'failed' });
  }
  if (!global.success) {
    await refundVisitor();
    return json(429, { code: 'global_limit', reset: global.reset });
  }
  const refund = () =>
    Promise.all([refundVisitor(), giveBack(deps.global, GLOBAL_ID, global.reset)]);

  const history = parsed.data.conversation
    ? await deps.conversations.load(parsed.data.conversation).catch(() => [])
    : [];
  const conversation = history.length > 0 ? parsed.data.conversation! : deps.newId();

  const stop = new AbortController();
  const gone = AbortSignal.any([request.signal, stop.signal]);
  const signal = AbortSignal.any([gone, AbortSignal.timeout(deps.timeoutMs)]);
  const encoder = new TextEncoder();
  let settle!: () => void;
  deps.defer(new Promise<void>(resolve => (settle = resolve)));

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: AskEvent) => {
        if (!gone.aborted) controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };
      const done = () => send({ type: 'done', remaining: visitor.remaining, conversation });
      let text = '';
      try {
        await deps.trace(conversation, async () => {
          if (await deps.moderate(question, signal)) {
            send({ type: 'text', text: BLOCKED_ANSWER });
            send({ type: 'sources', sources: [] });
            done();
            return;
          }
          const answer = deps.answer({ question, history, signal, now: new Date() });
          for await (const chunk of answer.text) {
            text += chunk;
            send({ type: 'text', text: chunk });
          }
          if (!text.trim()) throw new Error('empty answer');
          send({ type: 'sources', sources: answer.sources(text) });
          await deps.conversations
            .save(conversation, [...history, { question, answer: text.trim() }])
            .catch(() => undefined);
          done();
        });
      } catch {
        // A visitor who stops an answer has spent it. Text already shown is spent too:
        // refunding it would let a visitor force failures for free answers.
        if (!gone.aborted) {
          if (!text) await refund();
          send({ type: 'error', code: 'failed' });
        }
      } finally {
        if (!gone.aborted) controller.close();
        settle();
      }
    },
    cancel() {
      stop.abort();
    },
  });

  return new Response(body, {
    headers: { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store' },
  });
}
