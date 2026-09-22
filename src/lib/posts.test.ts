import { describe, expect, it } from 'vitest';
import { formatDate, publishedPosts } from './posts';

const post = (id: string, date: string) => ({ id, data: { publishedAt: new Date(date) } });

describe('publishedPosts', () => {
  it('drops posts dated after now', () => {
    const now = new Date('2026-09-22T12:00:00Z');
    const result = publishedPosts([post('past', '2026-09-01'), post('future', '2026-10-01')], now);
    expect(result.map(p => p.id)).toEqual(['past']);
  });

  it('keeps a post published exactly now', () => {
    const now = new Date('2026-09-22T00:00:00Z');
    expect(publishedPosts([post('today', '2026-09-22')], now)).toHaveLength(1);
  });

  it('sorts newest first', () => {
    const now = new Date('2026-09-22');
    const result = publishedPosts(
      [post('a', '2026-01-01'), post('c', '2026-03-01'), post('b', '2026-02-01')],
      now,
    );
    expect(result.map(p => p.id)).toEqual(['c', 'b', 'a']);
  });

  it('does not mutate its input', () => {
    const input = [post('a', '2026-01-01'), post('b', '2026-02-01')];
    publishedPosts(input, new Date('2026-09-22'));
    expect(input.map(p => p.id)).toEqual(['a', 'b']);
  });
});

describe('formatDate', () => {
  it('formats in French, long month, UTC', () => {
    expect(formatDate(new Date('2026-04-09'))).toBe('9 avril 2026');
  });
});
