// Post-build assertions on dist/. Run after `npm run build`.
import { access, readdir, readFile } from 'node:fs/promises';

const ORIGIN = 'https://www.victorlenain.fr';
const failures = [];
const exists = path =>
  access(path).then(
    () => true,
    () => false,
  );

const now = new Date();
const slugs = [];
for (const file of await readdir('src/content/posts')) {
  if (!file.endsWith('.mdx')) continue;
  const source = await readFile(`src/content/posts/${file}`, 'utf8');
  const date = source.match(/^publishedAt:\s*['"]?([\d-]+)/m)?.[1];
  if (!date) failures.push(`${file}: no publishedAt`);
  else if (new Date(date) <= now) slugs.push(file.replace(/\.mdx$/, ''));
}

const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
for (const slug of slugs) {
  if (!(await exists(`dist/blog/${slug}.html`))) failures.push(`missing dist/blog/${slug}.html`);
  if (!sitemap.includes(`<loc>${ORIGIN}/blog/${slug}</loc>`)) failures.push(`sitemap lacks ${slug}`);
}

for (const page of ['index', 'blog', 'projets', '404']) {
  if (!(await exists(`dist/${page}.html`))) failures.push(`missing dist/${page}.html`);
}
if (sitemap.includes('/services')) failures.push('sitemap still lists /services');
if (sitemap.includes('/404')) failures.push('sitemap lists /404');
if (/<loc>[^<]+\/<\/loc>/.test(sitemap.replace(`<loc>${ORIGIN}/</loc>`, '')))
  failures.push('sitemap has trailing-slash URLs');

const article = await readFile(`dist/blog/${slugs[0]}.html`, 'utf8');
if (!article.includes(`<link rel="canonical" href="${ORIGIN}/blog/${slugs[0]}">`))
  failures.push('article canonical is wrong');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`verify-build: ok (${slugs.length} posts)`);
