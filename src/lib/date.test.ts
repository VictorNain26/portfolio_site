import { describe, expect, it } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
  it('formats in French, long month, UTC', () => {
    expect(formatDate(new Date('2026-04-09'))).toBe('9 avril 2026');
  });
});
