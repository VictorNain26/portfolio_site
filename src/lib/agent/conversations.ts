import type { Redis } from '@upstash/redis';
import { safeValidateUIMessages } from 'ai';
import type { AskMessage } from './messages';

// Two turns, a question and its answer each.
const MAX_MESSAGES = 4;
const TTL_SECONDS = 24 * 60 * 60;

export type Conversations = {
  load(id: string): Promise<AskMessage[]>;
  save(id: string, messages: AskMessage[]): Promise<void>;
};

// Kept server-side under the chat id: the visitor sends only the new question and cannot forge
// what the agent said. https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-message-persistence
export function redisConversations(
  redis: Pick<Redis, 'get' | 'set'>,
  prefix: string,
): Conversations {
  const key = (id: string) => `${prefix}:${id}`;
  return {
    async load(id) {
      const stored = await redis.get<unknown>(key(id));
      if (stored == null) return [];
      const valid = await safeValidateUIMessages<AskMessage>({ messages: stored });
      // A conversation stored in an older format starts over rather than failing the question.
      return valid.success ? valid.data : [];
    },
    async save(id, messages) {
      await redis.set(key(id), messages.slice(-MAX_MESSAGES), { ex: TTL_SECONDS });
    },
  };
}
