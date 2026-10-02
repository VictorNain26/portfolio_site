import ipaddr from 'ipaddr.js';

export function visitorKey(ip: string): string | undefined {
  if (!ipaddr.isValid(ip)) return undefined;
  const address = ipaddr.process(ip);
  if (address.kind() === 'ipv4') return address.toString();
  const prefix = address.toNormalizedString().split(':').slice(0, 4).join(':');
  return `${prefix}::/64`;
}
