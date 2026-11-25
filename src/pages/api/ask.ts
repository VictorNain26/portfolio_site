import { createMistral } from '@ai-sdk/mistral';
import { Mistral } from '@mistralai/mistralai';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { waitUntil } from '@vercel/functions';
import type { APIRoute } from 'astro';
import {
  KV_REST_API_TOKEN,
  KV_REST_API_URL,
  LANGFUSE_BASE_URL,
  LANGFUSE_PUBLIC_KEY,
  LANGFUSE_SECRET_KEY,
  MISTRAL_API_KEY,
  VISITOR_SECRET,
} from 'astro:env/server';
import { createAgent, MODEL, REASONING } from '../../lib/agent/agent';
import { redisConversations } from '../../lib/agent/conversations';
import { documents, persona } from '../../lib/agent/corpus';
import { handleAsk } from '../../lib/agent/handler';
import { createModeration } from '../../lib/agent/moderation';
import { PROMPT_VERSION } from '../../lib/agent/prompt';
import { langfuseTracer, noTracer, startTelemetry } from '../../lib/agent/telemetry';

export const prerender = false;

// Every Vercel build is PROD: VERCEL_ENV tells production, preview and local dev apart.
const environment = process.env.VERCEL_ENV ?? 'development';
const telemetry = startTelemetry(
  { publicKey: LANGFUSE_PUBLIC_KEY, secretKey: LANGFUSE_SECRET_KEY, baseUrl: LANGFUSE_BASE_URL },
  environment,
);
// Previews share the production Redis: their own key prefix keeps tests off production quotas
// and conversations. Previews sit behind Vercel Authentication, so they get more questions.
const redis = new Redis({ url: KV_REST_API_URL, token: KV_REST_API_TOKEN });
const visitor = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(environment === 'production' ? 10 : 100, '1 d'),
  prefix: `ask:${environment}:visitor`,
});
const global = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(300, '1 d'),
  prefix: `ask:${environment}:global`,
});
const conversations = redisConversations(redis, `ask:${environment}:conversation`);
const moderate = createModeration(new Mistral({ apiKey: MISTRAL_API_KEY }));
const answer = createAgent({
  model: createMistral({ apiKey: MISTRAL_API_KEY })(MODEL),
  persona,
  documents,
  reasoning: REASONING,
});

export const POST: APIRoute = async context => {
  let ip: string | undefined;
  try {
    ip = context.clientAddress;
  } catch {
    ip = undefined;
  }
  return handleAsk(context.request, ip, {
    visitor,
    global,
    conversations,
    moderate,
    answer,
    trace: telemetry ? langfuseTracer(PROMPT_VERSION) : noTracer,
    defer: task => waitUntil(task.then(() => telemetry?.forceFlush())),
    newId: () => crypto.randomUUID(),
    timeoutMs: 50_000,
    visitorSecret: VISITOR_SECRET,
  });
};
