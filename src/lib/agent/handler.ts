import { z } from 'astro/zod';
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type ToolSet,
} from 'ai';
import type { Answer } from './agent';
import type { Conversations } from './conversations';
import { MAX_QUESTION, textOf, type AskMessage } from './messages';
import type { Source } from './sources';
import { visitorKey } from './visitor';

// `reset` ends the counted window; `reason: 'timeout'` is Upstash letting the call through
// when Redis is too slow to answer.
type Limit = { success: boolean; remaining: number; reset: number; reason?: string };
export type Limiter = { limit(id: string): Promise<Limit> };

export type AskDeps = {
  visitor: Limiter;
  global: Limiter;
  conversations: Conversations;
  // Vercel BotID's verdict on the request: a bot is refused before it spends a quota.
  isBot(request: Request): Promise<boolean>;
  moderate(question: string, signal: AbortSignal): Promise<boolean>;
  answer: Answer;
  trace: Tracer;
  // Keeps the function alive after the response for work that must not delay it.
  defer(task: Promise<unknown>): void;
  // Message ids are the server's: the visitor sends text only.
  newId(): string;
  timeoutMs: number;
  visitorSecret: string;
};

// One trace per question: the guardrail and the model call nest under it.
type TraceSpan = {
  guard(check: () => Promise<boolean>): Promise<boolean>;
  end(result: { answer: string; sources: Source[] } | { error: string }): void;
};
export type Tracer = <T>(
  context: { conversation: string; question: string; turn: number },
  run: (span: TraceSpan) => Promise<T>,
) => Promise<T>;

export const BLOCKED_ANSWER = 'Je préfère ne pas répondre à ça.';
// What the visitor reads when an answer fails; the cause goes to the logs.
export const FAILED = 'failed';
const GLOBAL_ID = 'global';

// What DefaultChatTransport sends once `prepareSendMessagesRequest` keeps the last message only:
// the chat id and the visitor's question. https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence
const bodySchema = z.object({
  id: z.string().regex(/^[\w-]{1,64}$/),
  message: z.object({
    role: z.literal('user'),
    parts: z.array(z.object({ type: z.literal('text'), text: z.string() })).length(1),
  }),
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
  if (await deps.isBot(request)) return json(403, { code: 'bot' });
  const key = ip === undefined ? undefined : visitorKey(ip, deps.visitorSecret);
  if (!key) return json(400, { code: 'ip' });
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  const question = parsed.success ? textOf(parsed.data.message).trim() : '';
  if (!parsed.success || !question || question.length > MAX_QUESTION)
    return json(400, { code: 'invalid' });
  const chat = parsed.data.id;

  // A quota store that does not answer fails closed: no free questions while it is down. A
  // question counts once accepted, even if its answer fails: Upstash documents no refund.
  // Every failure the visitor doesn't see is logged: Vercel files console.error as an error.
  const limit = (limiter: Limiter, id: string) =>
    limiter
      .limit(id)
      .then(result => {
        if (result.reason !== 'timeout') return result;
        console.error('ask: quota store timed out');
        return undefined;
      })
      .catch((error: unknown) => {
        console.error('ask: quota store failed', error);
        return undefined;
      });
  const visitor = await limit(deps.visitor, key);
  if (!visitor) return json(503, { code: FAILED });
  if (!visitor.success) return json(429, { code: 'limit', reset: visitor.reset });
  const global = await limit(deps.global, GLOBAL_ID);
  if (!global) return json(503, { code: FAILED });
  if (!global.success) return json(429, { code: 'global_limit', reset: global.reset });

  const history = await deps.conversations.load(chat).catch((error: unknown) => {
    console.error('ask: conversation load failed', error);
    return [];
  });
  const asked: AskMessage = {
    id: deps.newId(),
    role: 'user',
    parts: [{ type: 'text', text: question }],
  };
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(deps.timeoutMs)]);
  let settle!: () => void;
  deps.defer(new Promise<void>(resolve => (settle = resolve)));
  signal.addEventListener('abort', () => settle(), { once: true });
  let blocked = false;

  const stream = createUIMessageStream<AskMessage>({
    originalMessages: [...history, asked],
    generateId: deps.newId,
    onError: error => {
      console.error('ask: answer failed', error);
      return FAILED;
    },
    execute: ({ writer }) =>
      deps.trace(
        { conversation: chat, question, turn: Math.floor(history.length / 2) + 1 },
        async span => {
          writer.write({
            type: 'data-quota',
            data: { remaining: visitor.remaining, reset: visitor.reset },
            transient: true,
          });
          try {
            if (await span.guard(() => deps.moderate(question, signal))) {
              blocked = true;
              writer.write({ type: 'start' });
              writer.write({ type: 'text-start', id: 'blocked' });
              writer.write({ type: 'text-delta', id: 'blocked', delta: BLOCKED_ANSWER });
              writer.write({ type: 'text-end', id: 'blocked' });
              writer.write({ type: 'finish' });
              span.end({ answer: BLOCKED_ANSWER, sources: [] });
              return;
            }
            const { result, sources } = await deps.answer({
              messages: [...history, asked],
              signal,
              now: new Date(),
            });
            let text = '';
            let failure: unknown;
            let aborted = false;
            // Sources come after the text, before the finish: the answer names them.
            for await (const chunk of toUIMessageStream<ToolSet, AskMessage>({
              stream: result.stream,
              sendFinish: false,
              onError: error => {
                failure = error;
                console.error('ask: answer failed', error);
                return FAILED;
              },
            })) {
              if (chunk.type === 'text-delta') text += chunk.delta;
              if (chunk.type === 'abort') aborted = true;
              writer.write(chunk);
            }
            // The error or abort chunk is already on its way to the page.
            if (failure || aborted) {
              writer.setOutcome(
                failure ? { status: 'failed', error: failure } : { status: 'aborted' },
              );
              span.end({ error: failure instanceof Error ? failure.message : 'answer aborted' });
              return;
            }
            if (!text.trim()) throw new Error('empty answer');
            const cited = sources(text);
            for (const source of cited)
              writer.write({
                type: 'source-url',
                sourceId: source.url,
                url: source.url,
                title: source.title,
              });
            writer.write({ type: 'finish' });
            // The stream cannot tell a full answer from a cut one: the code declares it.
            writer.setOutcome({ status: 'completed' });
            span.end({ answer: text.trim(), sources: cited });
          } catch (error) {
            span.end({ error: error instanceof Error ? error.message : String(error) });
            throw error;
          }
        },
      ),
    onEnd: async ({ messages, outcome }) => {
      try {
        // A blocked question, a failed or a stopped answer is not part of the conversation.
        if (outcome.status === 'completed' && !blocked)
          await deps.conversations
            .save(chat, messages)
            .catch((error: unknown) => console.error('ask: conversation save failed', error));
      } finally {
        settle();
      }
    },
  });

  return createUIMessageStreamResponse({ stream, headers: { 'cache-control': 'no-store' } });
}
