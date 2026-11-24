import { describe, expect, it } from 'vitest';
import { staleAt } from './sync';

describe('staleAt', () => {
  it('is the next new year, in UTC', () => {
    expect(staleAt(new Date('2026-10-04T12:00:00Z'))).toEqual(new Date('2027-01-01T00:00:00Z'));
  });

  it('moves on once the new year has come', () => {
    expect(staleAt(new Date('2027-01-01T00:00:00Z'))).toEqual(new Date('2028-01-01T00:00:00Z'));
  });
});
