/**
 * Script to notify search engines after publishing new content.
 *
 * Usage:
 *   bun run scripts/notify-search-engines.ts                  # notify all pages
 *   bun run scripts/notify-search-engines.ts blog/my-slug     # notify specific page
 */
import { notifyIndexNow } from '../lib/indexnow';

const SITE_URL = 'https://victorlenain.fr';

async function main() {
  const arg = process.argv[2];

  let urls: string[];

  if (arg) {
    // Notify specific page
    const path = arg.startsWith('/') ? arg : `/${arg}`;
    urls = [`${SITE_URL}${path}`];
  } else {
    // Notify all important pages + sitemap discovery
    const sitemapRes = await fetch(`${SITE_URL}/sitemap.xml`);
    const sitemapXml = await sitemapRes.text();

    // Extract all <loc> URLs from sitemap
    const locRegex = /<loc>([^<]+)<\/loc>/g;
    urls = [];
    let match;
    while ((match = locRegex.exec(sitemapXml)) !== null) {
      if (match[1]) urls.push(match[1]);
    }

    if (urls.length === 0) {
      console.error('No URLs found in sitemap');
      process.exit(1);
    }
  }

  console.warn(`Notifying search engines about ${urls.length} URL(s):`);
  urls.forEach((u) => console.warn(`  ${u}`));

  await notifyIndexNow(urls);

  console.warn('\nDone! Bing/Yandex/Naver will process these URLs shortly.');
  console.warn('Note: Google does not support IndexNow. Submit URLs manually via Search Console.');
}

main().catch(console.error);
