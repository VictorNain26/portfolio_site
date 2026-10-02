import { LangfuseSpanProcessor } from '@langfuse/otel';
import { propagateAttributes, startActiveObservation } from '@langfuse/tracing';
import { LangfuseVercelAiSdkIntegration } from '@langfuse/vercel-ai-sdk';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerTelemetry } from 'ai';
import type { Tracer } from './handler';

export type LangfuseKeys = {
  publicKey: string | undefined;
  secretKey: string | undefined;
  baseUrl: string | undefined;
};

// Without keys the agent runs untraced: local dev and CI need no Langfuse project.
// https://langfuse.com/integrations/frameworks/vercel-ai-sdk
export function startTelemetry(keys: LangfuseKeys, environment: string) {
  if (!keys.publicKey || !keys.secretKey) return undefined;
  const processor = new LangfuseSpanProcessor({
    publicKey: keys.publicKey,
    secretKey: keys.secretKey,
    ...(keys.baseUrl && { baseUrl: keys.baseUrl }),
    environment,
  });
  new NodeTracerProvider({ spanProcessors: [processor] }).register();
  registerTelemetry(new LangfuseVercelAiSdkIntegration());
  return processor;
}

// Root `agent` observation per question, with the visitor's question as input and the answer
// as output; the moderation call is a `guardrail` under it, next to the AI SDK's generations
// and tool calls. https://langfuse.com/docs/observability/best-practices
export function langfuseTracer(version: string): Tracer {
  return (context, run) =>
    propagateAttributes(
      {
        traceName: 'answer-question',
        sessionId: context.conversation,
        version,
        tags: ['ask'],
        metadata: { turn: String(context.turn) },
      },
      () =>
        startActiveObservation(
          'answer-question',
          agent => {
            agent.update({ input: context.question });
            return run({
              guard: check =>
                startActiveObservation(
                  'moderate-question',
                  async guardrail => {
                    guardrail.update({ input: context.question });
                    const blocked = await check();
                    guardrail.update({ output: { blocked } });
                    return blocked;
                  },
                  { asType: 'guardrail' },
                ),
              end: result =>
                'error' in result
                  ? agent.update({ level: 'ERROR', statusMessage: result.error })
                  : agent.update({ output: result.answer, metadata: { sources: result.sources } }),
            });
          },
          { asType: 'agent' },
        ),
    );
}

// Without Langfuse keys the same code runs with no trace at all.
export const noTracer: Tracer = (_context, run) =>
  run({ guard: check => check(), end: () => undefined });
