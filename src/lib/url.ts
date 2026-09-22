export function canonicalUrl(pathname: string, site: URL): string {
  const clean = pathname.replace(/\.html$/, '').replace(/\/index$/, '') || '/';
  return new URL(clean, site).href;
}
