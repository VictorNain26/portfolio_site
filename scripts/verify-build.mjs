// Post-build assertions on dist/. Run after `npm run build`.
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { access, readdir, readFile } from 'node:fs/promises';

const ORIGIN = 'https://www.victorlenain.fr';
const PAPER = 'F2EFE8';

// URLs indexed before the Astro rebuild: each must keep answering, as a page or a vercel.json redirect.
const LEGACY_SLUGS = [
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

const failures = [];
const exists = path =>
  access(path).then(
    () => true,
    () => false,
  );

const luminance = hex => {
  const [r, g, b] = [0, 2, 4].map(i => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const now = new Date();
const published = [];
for (const file of await readdir('src/content/posts')) {
  if (!file.endsWith('.mdx')) continue;
  const source = await readFile(`src/content/posts/${file}`, 'utf8');
  const date = new Date(parseFrontmatter(source).frontmatter.publishedAt);
  if (Number.isNaN(date.getTime())) failures.push(`${file}: bad publishedAt`);
  else if (date <= now) published.push(file.replace(/\.mdx$/, ''));
}

const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
const redirected = new Set(
  JSON.parse(await readFile('vercel.json', 'utf8')).redirects.map(({ source }) => source),
);
for (const slug of LEGACY_SLUGS) {
  if (!published.includes(slug) && !redirected.has(`/blog/${slug}`))
    failures.push(`legacy /blog/${slug} is neither published nor redirected`);
}
for (const slug of published) {
  if (!(await exists(`dist/blog/${slug}.html`))) failures.push(`missing dist/blog/${slug}.html`);
  if (!sitemap.includes(`<loc>${ORIGIN}/blog/${slug}</loc>`))
    failures.push(`sitemap lacks ${slug}`);
  if (redirected.has(`/blog/${slug}`)) failures.push(`published /blog/${slug} is redirected away`);
}

for (const page of ['index', 'blog', 'projets', '404']) {
  if (!(await exists(`dist/${page}.html`))) failures.push(`missing dist/${page}.html`);
}
if ((await readdir('dist')).some(name => name.startsWith('services')))
  failures.push('dist still contains a services page');
if (sitemap.includes(`<loc>${ORIGIN}/services`)) failures.push('sitemap still lists /services');
if (sitemap.includes(`<loc>${ORIGIN}/404`)) failures.push('sitemap lists /404');
if (/<loc>[^<]+\/<\/loc>/.test(sitemap.replace(`<loc>${ORIGIN}/</loc>`, '')))
  failures.push('sitemap has trailing-slash URLs');

const notFound = await readFile('dist/404.html', 'utf8');
if (!notFound.includes('<meta name="robots" content="noindex">'))
  failures.push('404 lacks noindex');
if (notFound.includes('rel="canonical"')) failures.push('404 declares a canonical');

const home = await readFile('dist/index.html', 'utf8');
const h1 = home
  .match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]
  ?.replace(/<[^>]+>/g, '')
  .replace(/\s+/g, ' ')
  .trim();
if (h1 !== 'Victor Lenain') failures.push(`home h1 text is "${h1}"`);

const articles = published.map(slug => `blog/${slug}.html`);
for (const file of articles) {
  const html = await readFile(`dist/${file}`, 'utf8');
  for (const [, hex] of html.matchAll(/<span style="color:#([0-9A-Fa-f]{6})/g)) {
    const ratio = contrast(hex, PAPER);
    if (ratio < 4.5)
      failures.push(`${file}: code colour #${hex} is ${ratio.toFixed(2)}:1 on paper`);
  }
}

const jsonLdTypes = html =>
  [...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)].map(
    ([, json]) => JSON.parse(json)['@type'],
  );

const pages = ['index.html', 'blog.html', 'projets.html', '404.html', ...articles];
for (const file of pages) {
  const html = await readFile(`dist/${file}`, 'utf8');
  for (const [tag] of html.matchAll(/<a\b[^>]*href="https?:\/\/[^"]*"[^>]*>/g)) {
    if (tag.includes(`href="${ORIGIN}`)) continue;
    if (!tag.includes('target="_blank"') || !/rel="[^"]*noopener/.test(tag))
      failures.push(`${file}: external link without target/noopener: ${tag}`);
  }
  if (!jsonLdTypes(html).includes('WebSite')) failures.push(`${file}: no WebSite JSON-LD`);
  if (!html.includes('rel="alternate" type="application/rss+xml"'))
    failures.push(`${file}: no RSS autodiscovery link`);
}

const [slug] = published;
if (slug) {
  const article = await readFile(`dist/blog/${slug}.html`, 'utf8');
  if (!article.includes(`<link rel="canonical" href="${ORIGIN}/blog/${slug}">`))
    failures.push('article canonical is wrong');
  for (const property of ['article:published_time', 'article:author', 'og:image:alt']) {
    if (!article.includes(`property="${property}"`)) failures.push(`article lacks ${property}`);
  }
  if (!jsonLdTypes(article).includes('BreadcrumbList'))
    failures.push('article lacks BreadcrumbList');
  if (!/"publisher":\{/.test(article)) failures.push('BlogPosting lacks publisher');
  if (!article.includes('class="contact"')) failures.push('article lacks the contact block');
  if (!new RegExp(`<loc>${ORIGIN}/blog/${slug}</loc><lastmod>`).test(sitemap))
    failures.push('sitemap blog entries lack lastmod');
}

const blogIndex = await readFile('dist/blog.html', 'utf8');
if (!jsonLdTypes(blogIndex).includes('Blog')) failures.push('/blog lacks Blog JSON-LD');
if (
  !/<a[^>]*href="\/blog"[^>]*aria-current="page"|<a[^>]*aria-current="page"[^>]*href="\/blog"/.test(
    blogIndex,
  )
)
  failures.push('/blog nav link is not aria-current');

if (!(await exists('dist/rss.xml'))) failures.push('missing dist/rss.xml');
else {
  const rssXml = await readFile('dist/rss.xml', 'utf8');
  for (const post of published) {
    if (!rssXml.includes(`${ORIGIN}/blog/${post}<`)) failures.push(`rss lacks ${post}`);
  }
}

if (failures.length) {
  console.error([...new Set(failures)].join('\n'));
  process.exit(1);
}
console.log(`verify-build: ok (${published.length} posts)`);
