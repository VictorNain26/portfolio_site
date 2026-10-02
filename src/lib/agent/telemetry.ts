import { LangfuseSpanProcessor } from '@langfuse/otel';
import { LangfuseVercelAiSdkIntegration } from '@langfuse/vercel-ai-sdk';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerTelemetry } from 'ai';

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
