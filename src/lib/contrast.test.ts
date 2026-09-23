import { describe, expect, it } from 'vitest';
import { contrast } from './contrast';

describe('contrast', () => {
  it('spans 1:1 to 21:1', () => {
    expect(contrast('#ffffff', '#ffffff')).toBe(1);
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21);
  });

  it('does not depend on argument order', () => {
    expect(contrast('#1f3f95', '#f2efe8')).toBe(contrast('#f2efe8', '#1f3f95'));
  });

  it('matches the accent ratios documented in CLAUDE.md', () => {
    expect(contrast('#1F3F95', '#F2EFE8')).toBeCloseTo(8.3, 1);
    expect(contrast('#7b9cf0', '#1a1813')).toBeCloseTo(6.64, 1);
  });
});
