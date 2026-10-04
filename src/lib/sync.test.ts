import { describe, expect, it } from 'vitest';
import { staleAt } from './sync';

const now = new Date('2026-10-04T12:00:00Z');

describe('staleAt', () => {
  it('is the date of the next scheduled post', () => {
    const dates = ['2026-09-22', '2026-10-20', '2026-10-13'].map(day => new Date(day));
    expect(staleAt(dates, now)).toEqual(new Date('2026-10-13'));
  });

  it('is the new year when no post is scheduled', () => {
    expect(staleAt([new Date('2026-09-22')], now)).toEqual(new Date('2027-01-01T00:00:00Z'));
  });

  it('is the new year when it comes before the next post', () => {
    expect(staleAt([new Date('2027-02-01')], now)).toEqual(new Date('2027-01-01T00:00:00Z'));
  });
});
