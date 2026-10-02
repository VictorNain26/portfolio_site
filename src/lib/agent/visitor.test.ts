import { describe, expect, it } from 'vitest';
import { visitorKey } from './visitor';

describe('visitorKey', () => {
  it('keeps an IPv4 address as-is', () => {
    expect(visitorKey('1.2.3.4')).toBe('1.2.3.4');
  });

  it('resolves an IPv4-mapped IPv6 address to its IPv4', () => {
    expect(visitorKey('::ffff:1.2.3.4')).toBe('1.2.3.4');
  });

  it('keys other IPv6 addresses on their /64', () => {
    expect(visitorKey('2001:db8:1:2:aaaa::1')).toBe(visitorKey('2001:db8:1:2:bbbb::2'));
  });

  it('gives a different key outside the /64', () => {
    expect(visitorKey('2001:db8:1:3::1')).not.toBe(visitorKey('2001:db8:1:2:aaaa::1'));
  });

  it('returns undefined for an invalid address', () => {
    expect(visitorKey('nope')).toBeUndefined();
  });
});
