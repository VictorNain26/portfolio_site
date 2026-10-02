import { describe, expect, it } from 'vitest';
import { contrast } from './contrast';

describe('contrast', () => {
  it('spans 1:1 to 21:1', () => {
    expect(contrast('#ffffff', '#ffffff')).toBe(1);
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21);
  });

  it('does not depend on argument order', () => {
    expect(contrast('#5c5c5c', '#ffffff')).toBe(contrast('#ffffff', '#5c5c5c'));
  });

  it('matches the --muted ratios documented in CLAUDE.md', () => {
    expect(contrast('#5C5C5C', '#FFFFFF')).toBeCloseTo(6.69, 1);
    expect(contrast('#a6a6a6', '#121212')).toBeCloseTo(7.7, 1);
  });
});
