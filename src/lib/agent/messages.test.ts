import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { turnsOf, type AskMessage } from './messages';

const message = (role: 'user' | 'assistant', i: number): AskMessage => ({
  id: `${role}-${i}`,
  role,
  parts: [{ type: 'text', text: `${role} ${i}` }],
});

// Any thread the page can hold: questions, each answered or not (a failed request).
const threads = fc
  .array(fc.boolean(), { maxLength: 12 })
  .map(answered =>
    answered.flatMap((ok, i) =>
      ok ? [message('user', i), message('assistant', i)] : [message('user', i)],
    ),
  );

describe('turnsOf', () => {
  it('gives each question one turn, answered only by the assistant', () => {
    fc.assert(
      fc.property(threads, messages => {
        const turns = turnsOf(messages);
        expect(turns.map(turn => turn.question.id)).toEqual(
          messages.filter(m => m.role === 'user').map(m => m.id),
        );
        for (const { answer } of turns) if (answer) expect(answer.role).toBe('assistant');
      }),
    );
  });

  it('leaves a failed question unanswered rather than pairing it with the next one', () => {
    const [failed] = turnsOf([message('user', 0), message('user', 1), message('assistant', 1)]);
    expect(failed?.answer).toBeUndefined();
  });
});
