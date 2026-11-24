// Assertions on dist/: run after `npm run build`.
import * as cheerio from 'cheerio';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import config from '../astro.config.mjs';

const origin = new URL(config.site!).origin;
const client = 'dist/client';
// The Vercel adapter builds pages as directories: /projets is projets/index.html.
const pageFile = (page: string) =>
  page === 'index' || page === '404' ? `${page}.html` : `${page}/index.html`;

const read = (path: string) => readFileSync(path, 'utf8');
const html = (file: string) => cheerio.load(read(`${client}/${file}`));
const xml = (file: string) => cheerio.load(read(`${client}/${file}`), { xml: true });
const jsonLd = ($: cheerio.CheerioAPI): Record<string, unknown>[] =>
  $('script[type="application/ld+json"]')
    .toArray()
    .map(script => JSON.parse($(script).text()));
const types = ($: cheerio.CheerioAPI) => jsonLd($).map(data => data['@type']);

const llms = read(`${client}/llms.txt`);

type Redirect = { source: string; destination: string; statusCode: number };
const redirects: Redirect[] = JSON.parse(read('vercel.json')).redirects;
const $sitemap = xml('sitemap-0.xml');
const sitemap = new Set(
  $sitemap('url')
    .toArray()
    .map(url => $sitemap(url).find('loc').text()),
);
// The blog is gone: every URL it served, the legacy slugs before it included, goes home for good.
describe('removed blog', () => {
  it.each(['/blog', '/blog/:path*', '/rss.xml'])('redirects %s to / with a 301', source => {
    expect(redirects).toContainEqual({ source, destination: '/', statusCode: 301 });
  });

  it('no longer builds a blog page, an article or a feed', () => {
    expect(existsSync(`${client}/blog`)).toBe(false);
    expect(existsSync(`${client}/rss.xml`)).toBe(false);
    expect([...sitemap.keys()].filter(url => new URL(url).pathname.startsWith('/blog'))).toEqual(
      [],
    );
  });
});

describe.each(['index', 'projets', '404'].map(pageFile))('page %s', file => {
  const $ = html(file);

  it('opens external links in a new tab with noopener', () => {
    const external = $('a[href^="http"]')
      .toArray()
      .filter(link => !$(link).attr('href')?.startsWith(origin));
    for (const link of external) {
      expect($(link).attr('target'), $.html(link)).toBe('_blank');
      expect($(link).attr('rel'), $.html(link)).toMatch(/\bnoopener\b/);
    }
  });

  // The font subsets carry no arrows: Safari would draw them from the emoji font.
  it('draws arrows as icons, not text glyphs', () => {
    expect($('body').text()).not.toMatch(/[←-⇿]/);
  });

  it('has WebSite JSON-LD and no link to the removed blog', () => {
    expect(types($)).toContain('WebSite');
    expect($('link[rel="alternate"][type="application/rss+xml"]').length).toBe(0);
    expect($('a[href^="/blog"]').length).toBe(0);
  });
});

describe('site', () => {
  it('builds the fixed pages and no longer the services pages', () => {
    for (const page of ['index', 'projets', '404']) {
      expect(existsSync(`${client}/${pageFile(page)}`), page).toBe(true);
    }
    expect(readdirSync(client).filter(name => name.startsWith('services'))).toEqual([]);
  });

  it('serves /api/ask from a streaming function, not a prerendered file', () => {
    expect(existsSync(`${client}/api/ask`)).toBe(false);
    expect(existsSync(`${client}/api/ask/index.html`)).toBe(false);
    const config = JSON.parse(
      readFileSync('.vercel/output/functions/_render.func/.vc-config.json', 'utf8'),
    );
    expect(config).toMatchObject({ maxDuration: 60, supportsResponseStreaming: true });
  });

  it('keeps /services, /404 and trailing-slash URLs out of the sitemap', () => {
    for (const url of sitemap.keys()) {
      const { pathname } = new URL(url);
      expect(pathname).not.toMatch(/^\/(services|404)/);
      if (pathname !== '/') expect(pathname).not.toMatch(/\/$/);
    }
  });

  // The sync workflow hashes the same file: any other input would redeploy every 15 minutes.
  it('publishes what it was built from for the sync workflow, outside the sitemap', () => {
    const sync = JSON.parse(read(`${client}/sync.json`));
    const github = createHash('sha256').update(readFileSync('src/data/github.json')).digest('hex');
    expect(sync.github).toBe(github);
    expect(new Date(sync.staleAt).getTime()).toBeGreaterThan(Date.now());
    expect([...sitemap.keys()].filter(url => url.endsWith('.json'))).toEqual([]);
  });

  it('marks the 404 noindex, without a canonical', () => {
    const $ = html('404.html');
    expect($('meta[name="robots"]').attr('content')).toBe('noindex');
    expect($('link[rel="canonical"]').length).toBe(0);
  });

  it('titles the home page with the name', () => {
    expect(html('index.html')('h1').text().replace(/\s+/g, ' ').trim()).toBe('Victor Lenain');
  });

  it('builds llms.txt from the projects, without the removed blog', async () => {
    const { projects } = await import('../src/data/projects');
    expect(llms.startsWith('# Victor Lenain\n\n> ')).toBe(true);
    for (const project of projects) expect(llms).toContain(`[${project.name}](${project.url})`);
    expect(llms).not.toMatch(/\/blog|rss\.xml/);
  });

  it('lists every project in the /projets ItemList JSON-LD', async () => {
    const { projects } = await import('../src/data/projects');
    const list = jsonLd(html(pageFile('projets'))).find(item => item['@type'] === 'ItemList');
    expect(list?.['numberOfItems']).toBe(projects.length);
  });
});
