import { createMistral } from '@ai-sdk/mistral';
import { propagateAttributes } from '@langfuse/tracing';
import { Mistral } from '@mistralai/mistralai';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { waitUntil } from '@vercel/functions';
import type { APIRoute } from 'astro';
import {
  GITHUB_TOKEN,
  KV_REST_API_TOKEN,
  KV_REST_API_URL,
  LANGFUSE_BASE_URL,
  LANGFUSE_PUBLIC_KEY,
  LANGFUSE_SECRET_KEY,
  MISTRAL_API_KEY,
} from 'astro:env/server';
import { createActivityFetcher } from '../../lib/agent/activity';
import { createAgent, MODEL } from '../../lib/agent/agent';
import { redisConversations } from '../../lib/agent/conversations';
import { knowledge } from '../../lib/agent/corpus';
import { handleAsk } from '../../lib/agent/handler';
import { documentsOf } from '../../lib/agent/knowledge';
import { createModeration } from '../../lib/agent/moderation';
import { startTelemetry } from '../../lib/agent/telemetry';
import { site } from '../../site';

export const prerender = false;

const telemetry = startTelemetry(
  { publicKey: LANGFUSE_PUBLIC_KEY, secretKey: LANGFUSE_SECRET_KEY, baseUrl: LANGFUSE_BASE_URL },
  import.meta.env.PROD ? 'production' : 'development',
);
const redis = new Redis({ url: KV_REST_API_URL, token: KV_REST_API_TOKEN });
const visitor = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(3, '1 d'),
  prefix: 'ask:visitor',
});
const global = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(300, '1 d'),
  prefix: 'ask:global',
});
// Posts scheduled after the build have no page yet: the agent must not know them.
const documents = documentsOf(knowledge, new Date(__BUILD_TIME__), import.meta.env.SITE);
const answer = createAgent({
  model: createMistral({ apiKey: MISTRAL_API_KEY })(MODEL),
  knowledge,
  documents,
  activity: createActivityFetcher({
    user: new URL(site.links.github).pathname.slice(1),
    token: GITHUB_TOKEN,
  }),
  reasoning: 'none',
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
    conversations: redisConversations(redis),
    moderate: createModeration(new Mistral({ apiKey: MISTRAL_API_KEY })),
    answer,
    trace: (conversation, run) =>
      propagateAttributes({ traceName: 'ask', sessionId: conversation }, run),
    defer: task => waitUntil(task.then(() => telemetry?.forceFlush())),
    newId: () => crypto.randomUUID(),
    timeoutMs: 50_000,
  });
};
