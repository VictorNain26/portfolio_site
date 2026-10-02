import ipaddr from 'ipaddr.js';
import { createHmac } from 'node:crypto';

// The quota key at Upstash: an IPv4, or the /64 of an IPv6 (one home network), keyed with a
// server secret so that no raw address leaves the function.
export function visitorKey(ip: string, secret: string): string | undefined {
  if (!ipaddr.isValid(ip)) return undefined;
  const address = ipaddr.process(ip);
  const network =
    address.kind() === 'ipv4'
      ? address.toString()
      : `${address.toNormalizedString().split(':').slice(0, 4).join(':')}::/64`;
  return createHmac('sha256', secret).update(network).digest('hex').slice(0, 32);
}
