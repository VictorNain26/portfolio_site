// Assertions on dist/: run after `npm run build`.
import { parseFrontmatter } from '@astrojs/markdown-remark';
import * as cheerio from 'cheerio';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import config from '../astro.config.mjs';
import { contrast } from '../src/lib/contrast';

const origin = new URL(config.site!).origin;
const paper = { light: '#f2efe8', dark: '#1a1813' };

// URLs indexed before the Astro rebuild: each must keep answering, as a page or a vercel.json redirect.
const legacySlugs = [
  '2025-01-12-developpeur-freelance-paris',
  '2026-02-18-pourquoi-travailler-avec-un-freelance-fullstack',
  '2026-02-24-tomia-tuteur-ia-soutien-scolaire',
  '2026-02-26-communication-cle-projet-web-reussi',
  '2026-03-03-aubesonore-web-radio-automatisee-ia',
  '2026-03-05-site-vitrine-vs-application-web',
  '2026-03-10-parcours-atypique-developpeur-freelance',
  '2026-03-12-integration-ia-pme-cout-reel',
  '2026-03-17-erreurs-externalisation-developpement-web',
  '2026-03-19-pourquoi-audit-technique-startup',
  '2026-03-24-workflow-claude-code-freelance',
  '2026-03-26-seo-moteurs-recherche-ia',
  '2026-03-31-nextjs-16-turbopack-retour-experience',
  '2026-04-02-bilan-deux-ans-freelance-cdi',
  '2026-04-07-passkeys-authentification-sans-mot-de-passe',
  '2026-04-09-react-server-components-production',
];

const read = (path: string) => readFileSync(path, 'utf8');
const html = (file: string) => cheerio.load(read(`dist/${file}`));
const xml = (file: string) => cheerio.load(read(`dist/${file}`), { xml: true });
const jsonLd = ($: cheerio.CheerioAPI): Record<string, unknown>[] =>
  $('script[type="application/ld+json"]')
    .toArray()
    .map(script => JSON.parse($(script).text()));
const types = ($: cheerio.CheerioAPI) => jsonLd($).map(data => data['@type']);

const posts = readdirSync('src/content/posts')
  .filter(file => file.endsWith('.mdx'))
  .map(file => ({
    file,
    slug: file.replace(/\.mdx$/, ''),
    publishedAt: new Date(
      parseFrontmatter(read(`src/content/posts/${file}`)).frontmatter.publishedAt,
    ),
  }));
const now = new Date();
const published = posts.filter(post => post.publishedAt <= now).map(post => post.slug);
const articles = published.map(slug => `blog/${slug}.html`);

const redirected = new Set<string>(
  JSON.parse(read('vercel.json')).redirects.map(({ source }: { source: string }) => source),
);
const $sitemap = xml('sitemap-0.xml');
const sitemap = new Map(
  $sitemap('url')
    .toArray()
    .map(url => [$sitemap(url).find('loc').text(), $sitemap(url).find('lastmod').text()]),
);
const $rss = xml('rss.xml');
const rssLinks = $rss('item > link')
  .toArray()
  .map(link => $rss(link).text());

describe('posts', () => {
  it.each(posts)('$file has a valid publishedAt', ({ publishedAt }) => {
    expect(publishedAt.getTime()).not.toBeNaN();
  });

  it.each(legacySlugs)('legacy /blog/%s is published or redirected', slug => {
    expect(published.includes(slug) || redirected.has(`/blog/${slug}`)).toBe(true);
  });
});

describe.each(published)('article %s', slug => {
  const url = `${origin}/blog/${slug}`;
  const $ = html(`blog/${slug}.html`);

  it('is not redirected away', () => {
    expect(redirected.has(`/blog/${slug}`)).toBe(false);
  });

  it('is in the sitemap with a lastmod, and in the RSS feed', () => {
    expect(sitemap.get(url)).toBeTruthy();
    expect(rssLinks).toContain(url);
  });

  it('declares its canonical and article metadata', () => {
    expect($('link[rel="canonical"]').attr('href')).toBe(url);
    for (const property of ['article:published_time', 'article:author', 'og:image:alt']) {
      expect($(`meta[property="${property}"]`).length, property).toBe(1);
    }
  });

  it('has BlogPosting with a publisher and BreadcrumbList JSON-LD', () => {
    const data = jsonLd($);
    expect(data.find(item => item['@type'] === 'BlogPosting')?.['publisher']).toBeDefined();
    expect(types($)).toContain('BreadcrumbList');
  });

  it('ends with the contact block', () => {
    expect($('.contact').length).toBe(1);
  });

  it('keeps code colours at 4.5:1 or more on both papers', () => {
    for (const span of $('pre span[style]').toArray()) {
      for (const declaration of ($(span).attr('style') ?? '').split(';')) {
        const [property, value = ''] = declaration.split(':');
        const theme = property === 'color' ? 'light' : property === '--shiki-dark' ? 'dark' : null;
        if (theme)
          expect(contrast(value, paper[theme]), `${property}:${value}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});

describe.each(['index.html', 'blog.html', 'projets.html', '404.html', ...articles])(
  'page %s',
  file => {
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

    it('has WebSite JSON-LD and RSS autodiscovery', () => {
      expect(types($)).toContain('WebSite');
      expect($('link[rel="alternate"][type="application/rss+xml"]').length).toBe(1);
    });
  },
);

describe('site', () => {
  it('builds the fixed pages and no longer the services pages', () => {
    for (const page of ['index', 'blog', 'projets', '404']) {
      expect(existsSync(`dist/${page}.html`), page).toBe(true);
    }
    expect(readdirSync('dist').filter(name => name.startsWith('services'))).toEqual([]);
  });

  it('keeps /services, /404 and trailing-slash URLs out of the sitemap', () => {
    for (const url of sitemap.keys()) {
      const { pathname } = new URL(url);
      expect(pathname).not.toMatch(/^\/(services|404)/);
      if (pathname !== '/') expect(pathname).not.toMatch(/\/$/);
    }
  });

  it('marks the 404 noindex, without a canonical', () => {
    const $ = html('404.html');
    expect($('meta[name="robots"]').attr('content')).toBe('noindex');
    expect($('link[rel="canonical"]').length).toBe(0);
  });

  it('titles the home page with the name', () => {
    expect(html('index.html')('h1').text().replace(/\s+/g, ' ').trim()).toBe('Victor Lenain');
  });

  it('gives /blog its Blog JSON-LD and marks its nav link current', () => {
    const $ = html('blog.html');
    expect(types($)).toContain('Blog');
    expect($('a[href="/blog"][aria-current="page"]').length).toBe(1);
  });
});
