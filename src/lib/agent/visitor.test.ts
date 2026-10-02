import { describe, expect, it } from 'vitest';
import { visitorKey } from './visitor';

const key = (ip: string, secret = 's3cret') => visitorKey(ip, secret);

describe('visitorKey', () => {
  it('never carries the address itself', () => {
    expect(key('1.2.3.4')).not.toContain('1.2.3.4');
    expect(key('1.2.3.4')).toMatch(/^[0-9a-f]{32}$/);
  });

  it('changes with the secret', () => {
    expect(key('1.2.3.4', 'a')).not.toBe(key('1.2.3.4', 'b'));
  });

  it('resolves an IPv4-mapped IPv6 address to its IPv4', () => {
    expect(key('::ffff:1.2.3.4')).toBe(key('1.2.3.4'));
  });

  it('keys other IPv6 addresses on their /64', () => {
    expect(key('2001:db8:1:2:aaaa::1')).toBe(key('2001:db8:1:2:bbbb::2'));
  });

  it('gives a different key outside the /64', () => {
    expect(key('2001:db8:1:3::1')).not.toBe(key('2001:db8:1:2:aaaa::1'));
  });

  it('returns undefined for an invalid address', () => {
    expect(key('nope')).toBeUndefined();
  });
});
