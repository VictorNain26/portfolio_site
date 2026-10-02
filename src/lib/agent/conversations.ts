import type { Redis } from '@upstash/redis';
import type { Turn } from './agent';

export const MAX_TURNS = 2;
const TTL_SECONDS = 24 * 60 * 60;

export type Conversations = {
  load(id: string): Promise<Turn[]>;
  save(id: string, turns: Turn[]): Promise<void>;
};

// Kept server-side under a random id: the visitor cannot forge what the agent said.
export function redisConversations(redis: Pick<Redis, 'get' | 'set'>): Conversations {
  const key = (id: string) => `ask:conversation:${id}`;
  return {
    async load(id) {
      return (await redis.get<Turn[]>(key(id))) ?? [];
    },
    async save(id, turns) {
      await redis.set(key(id), turns.slice(-MAX_TURNS), { ex: TTL_SECONDS });
    },
  };
}
