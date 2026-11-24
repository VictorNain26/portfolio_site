import fc from 'fast-check';
import ipaddr from 'ipaddr.js';
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

describe('visitorKey properties', () => {
  const secret = 's3cret';
  const hextet = fc.integer({ min: 0, max: 0xffff }).map(n => n.toString(16));
  // ::ffff:0:0/96 holds the IPv4-mapped addresses, which are keyed as IPv4: left out of the /64s.
  const prefix = fc
    .array(hextet, { minLength: 4, maxLength: 4 })
    .filter(network => network.some(part => part !== '0'));

  it('gives an IPv4 the same key every time, and a key to every IPv4', () => {
    fc.assert(
      fc.property(fc.ipV4(), ip => {
        const key = visitorKey(ip, secret);
        expect(key).toMatch(/^[0-9a-f]{32}$/);
        expect(visitorKey(ip, secret)).toBe(key);
      }),
    );
  });

  it('gives every address of an IPv6 /64 the same key', () => {
    fc.assert(
      fc.property(
        prefix,
        fc.array(hextet, { minLength: 4, maxLength: 4 }),
        fc.array(hextet, { minLength: 4, maxLength: 4 }),
        (network, a, b) => {
          expect(visitorKey([...network, ...a].join(':'), secret)).toBe(
            visitorKey([...network, ...b].join(':'), secret),
          );
        },
      ),
    );
  });

  it('refuses anything that is not an IP address', () => {
    fc.assert(
      fc.property(fc.string(), text => {
        fc.pre(!ipaddr.isValid(text));
        expect(visitorKey(text, secret)).toBeUndefined();
      }),
    );
  });
});
