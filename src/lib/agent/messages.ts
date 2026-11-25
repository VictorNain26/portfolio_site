import type { UIMessage } from 'ai';

// The visitor's quota after this question, sent as a transient data part: it updates the page,
// never the stored conversation. https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data
export type Quota = { remaining: number; reset: number };

// The messages the page and /api/ask exchange, in the AI SDK's UI message format.
export type AskMessage = UIMessage<never, { quota: Quota }>;

export const MAX_QUESTION = 280;

// The text a message carries, its text parts joined.
export const textOf = (message: Pick<AskMessage, 'parts'>) =>
  message.parts.flatMap(part => (part.type === 'text' ? [part.text] : [])).join('');

// The thread as question/answer turns. A question whose request failed has no answer.
export const turnsOf = (messages: AskMessage[]) =>
  messages.flatMap((message, i) =>
    message.role === 'user'
      ? [
          {
            question: message,
            answer: messages[i + 1]?.role === 'assistant' ? messages[i + 1] : undefined,
          },
        ]
      : [],
  );
