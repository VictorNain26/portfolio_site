# Astro Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Next.js site with a static Astro 7 site: one-screen homepage, `/projets`, `/blog`, in the « Papier & encre » identity.

**Architecture:** Static Astro build (`build.format: 'file'`) deployed on the existing Vercel project with `framework: "astro"`. Blog posts stay MDX files loaded by a content collection. Styling is plain CSS with custom properties; all motion is CSS. Two pure helpers in `src/lib` carry the only logic and are unit-tested.

**Tech Stack:** Astro 7.3, @astrojs/mdx 8, @astrojs/sitemap 3.7, TypeScript 6, Vitest 5, Prettier 3 + prettier-plugin-astro, npm, Node ≥ 22.12.

**Spec:** `docs/superpowers/specs/2026-09-22-astro-rebuild-design.md`

## Global Constraints

- Site origin: `https://www.victorlenain.fr`. URLs never end with `/` (except `/`).
- Palette: `--paper #F2EFE8`, `--ink #16140F`, `--ink-soft #5E594F`, `--rule #D9D3C7`, `--accent #E4412B`. Accent never colours running text (3.59:1 on paper; large text and UI only).
- Fonts: Instrument Serif (display, 400 normal + italic), Inter Tight (text, 400/500). Code: `ui-monospace` stack.
- No client JS except the Umami script (`data-website-id="cddff34c-b72b-4f84-b155-b327edd3d634"`).
- All motion disabled under `prefers-reduced-motion: reduce`.
- French copy, English code and commits. Commit format `<type>(<scope>): <description>`, ending with `Co-Authored-By: Claude <noreply@anthropic.com>`.
- `docs/` is gitignored on purpose: add plan/spec files with `git add -f`.
- Stage files explicitly; never `--no-verify`.

## File map

| File                                   | Responsibility                                         |
| -------------------------------------- | ------------------------------------------------------ |
| `package.json`                         | scripts, deps, engines                                 |
| `astro.config.mjs`                     | site, URL format, integrations, fonts, code theme      |
| `tsconfig.json`                        | extends `astro/tsconfigs/strictest`                    |
| `.prettierrc.mjs`, `.prettierignore`   | formatting                                             |
| `vercel.json`                          | framework, clean URLs, 301s                            |
| `src/site.ts`                          | site-wide constants (name, links, description)         |
| `src/lib/posts.ts`                     | `publishedPosts`, `formatDate` (tested)                |
| `src/lib/url.ts`                       | `canonicalUrl` (tested)                                |
| `src/content.config.ts`                | `posts` collection                                     |
| `src/content/posts/*.mdx`              | the 16 articles (moved)                                |
| `src/data/projects.ts`                 | hand-written project list                              |
| `src/styles/global.css`                | tokens, reset, typography, links, motion               |
| `src/layouts/Base.astro`               | `<head>`, SEO, JSON-LD, header, footer                 |
| `src/pages/index.astro`                | one-screen home                                        |
| `src/pages/projets.astro`              | project list                                           |
| `src/pages/blog/index.astro`           | post list                                              |
| `src/pages/blog/[slug].astro`          | article                                                |
| `src/pages/404.astro`                  | not found                                              |
| `public/*`                             | favicon, apple icon, manifest, robots, llms.txt, og.png |
| `scripts/og.mjs`                       | one-off OG image generator                             |
| `scripts/verify-build.mjs`             | asserts on `dist/` after build                         |

---

### Task 1: Replace the Next.js stack with an empty Astro project

**Files:**

- Delete: every tracked file except `content/posts/`, `docs/`, `public/logo.png`, `public/logo-email.png`, `public/web-app-manifest-*.png`, `public/llms.txt`, `app/favicon.ico`, `app/apple-icon.png`, `.prettierignore`, `.gitignore`, `CLAUDE.md`, `README.md` (if present)
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.prettierrc.mjs`, `vercel.json`, `src/pages/index.astro`
- Modify: `.gitignore`, `.prettierignore`

**Interfaces:**

- Produces: `npm run build|check|test|format:check`, `npm run verify:build` (script file added in Task 7).

- [ ] **Step 1: List what is tracked**

Run: `git ls-files | grep -v '^content/posts/' | grep -v '^docs/'`
Read the list; everything not in the keep-list above goes.

- [ ] **Step 2: Move the kept icons and delete the rest**

```bash
git mv app/favicon.ico public/favicon.ico
git mv app/apple-icon.png public/apple-touch-icon.png
git rm -r -q --ignore-unmatch app components hooks lib scripts __tests__
git rm -q --ignore-unmatch content-collections.ts 'next.config.*' eslint.config.mjs .oxlintrc.json \
  global.d.ts next-env.d.ts bun.lock vitest.config.ts 'vitest.setup.*' tsconfig.json \
  'postcss.config.*' components.json .prettierrc.js public/images/hero-bg.webp \
  public/1a09ed4391564f649e827b97f1b3c59a.txt package.json
git status --short | grep -v '^D ' ; git ls-files | grep -v '^content/posts/' | grep -v '^docs/'
```

Expected: only the keep-list remains. Remove any leftover Next-specific file shown by the last command with `git rm`. Then `rm -rf node_modules .next .content-collections` (untracked build output).

- [ ] **Step 3: Write `package.json`**

```json
{
  "name": "portfolio",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "verify:build": "node scripts/verify-build.mjs",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

- [ ] **Step 4: Install dependencies**

```bash
npm install astro@^7.3.4 @astrojs/mdx@^8.0.2 @astrojs/sitemap@^3.7.4
npm install -D @astrojs/check typescript@^6 vitest@^5 prettier@^3 prettier-plugin-astro
```

Expected: `package-lock.json` created, no `ERR!`.

- [ ] **Step 5: Write `astro.config.mjs`**

```js
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.victorlenain.fr',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [mdx(), sitemap()],
  markdown: { shikiConfig: { theme: 'github-light' } },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Instrument Serif',
      cssVariable: '--font-display',
      weights: [400],
      styles: ['normal', 'italic'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter Tight',
      cssVariable: '--font-text',
      weights: [400, 500],
      styles: ['normal'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
});
```

- [ ] **Step 6: Write `tsconfig.json`, `.prettierrc.mjs`, `vercel.json`**

`tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strictest",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

`.prettierrc.mjs`:

```js
/** @type {import('prettier').Config} */
export default {
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  printWidth: 100,
  endOfLine: 'lf',
  plugins: ['prettier-plugin-astro'],
  overrides: [
    { files: '*.astro', options: { parser: 'astro' } },
    { files: '*.md', options: { proseWrap: 'always', printWidth: 80 } },
  ],
};
```

`vercel.json` (sources: https://vercel.com/docs/project-configuration/vercel-json — `framework`, `cleanUrls`, `trailingSlash`, `redirects`; `astro` slug checked against https://openapi.vercel.sh/vercel.json):

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "astro",
  "cleanUrls": true,
  "trailingSlash": false,
  "redirects": [
    { "source": "/services", "destination": "/", "statusCode": 301 },
    { "source": "/services/:path*", "destination": "/", "statusCode": 301 }
  ]
}
```

- [ ] **Step 7: Update `.gitignore` and `.prettierignore`**

`.gitignore`:

```
node_modules/
dist/
.astro/
*.log
.env*
.vscode/
.claude/
coverage/

# Docs stratégie/prospection
docs/
```

`.prettierignore`:

```
dist/
.astro/
node_modules/
package-lock.json
src/content/posts/
docs/
```

- [ ] **Step 8: Placeholder home page**

`src/pages/index.astro`:

```astro
---
---

<p>Victor Lenain</p>
```

- [ ] **Step 9: Verify**

Run: `npm run check && npm run build`
Expected: `0 errors`, `1 page(s) built`, `dist/index.html` exists.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .prettierrc.mjs \
  .prettierignore .gitignore vercel.json src/pages/index.astro
git status --short   # only staged changes; deletions were staged by git rm/git mv
git commit -m "build: replace the Next.js stack with an empty Astro 7 project

Vercel config per https://vercel.com/docs/project-configuration/vercel-json
(framework, cleanUrls, trailingSlash, redirects).

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 2: Pure helpers (TDD)

**Files:**

- Create: `src/lib/posts.ts`, `src/lib/posts.test.ts`, `src/lib/url.ts`, `src/lib/url.test.ts`

**Interfaces:**

- Produces:
  - `publishedPosts<T extends { data: { publishedAt: Date } }>(posts: T[], now: Date): T[]` — keeps `publishedAt <= now`, newest first.
  - `formatDate(date: Date): string` — `'9 avril 2026'`, computed in UTC.
  - `canonicalUrl(pathname: string, site: URL): string` — strips `.html` and a trailing `/index`; `'/index.html'` → origin + `/`.

- [ ] **Step 1: Write the failing tests**

`src/lib/posts.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatDate, publishedPosts } from './posts';

const post = (id: string, date: string) => ({ id, data: { publishedAt: new Date(date) } });

describe('publishedPosts', () => {
  it('drops posts dated after now', () => {
    const now = new Date('2026-09-22T12:00:00Z');
    const result = publishedPosts([post('past', '2026-09-01'), post('future', '2026-10-01')], now);
    expect(result.map(p => p.id)).toEqual(['past']);
  });

  it('keeps a post published exactly now', () => {
    const now = new Date('2026-09-22T00:00:00Z');
    expect(publishedPosts([post('today', '2026-09-22')], now)).toHaveLength(1);
  });

  it('sorts newest first', () => {
    const now = new Date('2026-09-22');
    const result = publishedPosts(
      [post('a', '2026-01-01'), post('c', '2026-03-01'), post('b', '2026-02-01')],
      now,
    );
    expect(result.map(p => p.id)).toEqual(['c', 'b', 'a']);
  });

  it('does not mutate its input', () => {
    const input = [post('a', '2026-01-01'), post('b', '2026-02-01')];
    publishedPosts(input, new Date('2026-09-22'));
    expect(input.map(p => p.id)).toEqual(['a', 'b']);
  });
});

describe('formatDate', () => {
  it('formats in French, long month, UTC', () => {
    expect(formatDate(new Date('2026-04-09'))).toBe('9 avril 2026');
  });
});
```

`src/lib/url.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { canonicalUrl } from './url';

const site = new URL('https://www.victorlenain.fr');

describe('canonicalUrl', () => {
  it('maps the home page to the origin', () => {
    expect(canonicalUrl('/index.html', site)).toBe('https://www.victorlenain.fr/');
    expect(canonicalUrl('/', site)).toBe('https://www.victorlenain.fr/');
  });

  it('strips the .html extension added by build.format "file"', () => {
    expect(canonicalUrl('/blog.html', site)).toBe('https://www.victorlenain.fr/blog');
    expect(canonicalUrl('/blog/mon-article.html', site)).toBe(
      'https://www.victorlenain.fr/blog/mon-article',
    );
  });

  it('leaves clean paths untouched', () => {
    expect(canonicalUrl('/projets', site)).toBe('https://www.victorlenain.fr/projets');
  });
});
```

- [ ] **Step 2: Run the tests, expect failure**

Run: `npm test`
Expected: FAIL, cannot resolve `./posts` and `./url`.

- [ ] **Step 3: Implement**

`src/lib/posts.ts`:

```ts
export function publishedPosts<T extends { data: { publishedAt: Date } }>(
  posts: T[],
  now: Date,
): T[] {
  return posts
    .filter(post => post.data.publishedAt <= now)
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

const dateFormat = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(date: Date): string {
  return dateFormat.format(date);
}
```

`src/lib/url.ts`:

```ts
export function canonicalUrl(pathname: string, site: URL): string {
  const clean = pathname.replace(/\.html$/, '').replace(/\/index$/, '') || '/';
  return new URL(clean, site).href;
}
```

- [ ] **Step 4: Run the tests, expect success**

Run: `npm test && npm run check`
Expected: 8 tests passed, `0 errors`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/posts.ts src/lib/posts.test.ts src/lib/url.ts src/lib/url.test.ts
git commit -m "feat(lib): add post filtering, date formatting and canonical URL helpers

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 3: Design system and base layout

**Files:**

- Create: `src/site.ts`, `src/styles/global.css`, `src/layouts/Base.astro`
- Modify: `src/pages/index.astro` (use the layout, still placeholder content)

**Interfaces:**

- Consumes: `canonicalUrl` from `src/lib/url.ts`.
- Produces:
  - `site` object: `{ name, title, description, email, calUrl, links: { linkedin, github, malt } }`.
  - `personJsonLd` object.
  - `Base.astro` props: `title?: string` (page title, suffixed `| Victor Lenain`; omitted on home), `description?: string`, `type?: 'website' | 'article'`, `jsonLd?: Record<string, unknown>[]`, `header?: boolean` (default `true`).
  - CSS classes: `.wrap` (page column), `.link` (drawn underline), `.meta` (soft small text), `.display` (serif).

- [ ] **Step 1: `src/site.ts`**

```ts
export const site = {
  name: 'Victor Lenain',
  title: 'Victor Lenain · Développeur full-stack · Intégration IA · Paris',
  description:
    "Développeur full-stack freelance à Paris. J'ajoute la couche IA (agents, RAG, automatisations) à votre produit existant, sans tout refaire.",
  email: 'victor.lenain26@gmail.com',
  calUrl: 'https://cal.com/victor-lenain-ejsjfb/echange-decouverte',
  links: {
    linkedin: 'https://www.linkedin.com/in/victorlenain/',
    github: 'https://github.com/VictorNain26',
    malt: 'https://www.malt.fr/profile/victorlenain',
  },
} as const;

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://www.victorlenain.fr/#person',
  name: site.name,
  jobTitle: 'Développeur full-stack · Intégration IA',
  description: site.description,
  url: 'https://www.victorlenain.fr',
  image: 'https://www.victorlenain.fr/og.png',
  email: `mailto:${site.email}`,
  sameAs: Object.values(site.links),
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
    addressLocality: 'Paris',
    addressRegion: 'Île-de-France',
  },
  knowsAbout: [
    'Intégration IA',
    'LLM',
    'RAG',
    'Agents IA',
    'Anthropic Claude',
    'OpenAI',
    'pgvector',
    'Développement web',
    'TypeScript',
    'Next.js',
    'Astro',
    'PostgreSQL',
  ],
};
```

- [ ] **Step 2: `src/styles/global.css`**

```css
:root {
  --paper: #f2efe8;
  --ink: #16140f;
  --ink-soft: #5e594f;
  --rule: #d9d3c7;
  --accent: #e4412b;
  --ease-out: cubic-bezier(0.2, 0.7, 0, 1);
  --gutter: clamp(1.25rem, 5vw, 4rem);
  --measure: 65ch;
  color-scheme: light;
}

@view-transition {
  navigation: auto;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: var(--paper);
  /* Paper grain: tiny tiled SVG noise, no request. */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.07'/%3E%3C/svg%3E");
  color: var(--ink);
  font-family: var(--font-text);
  font-size: 1.0625rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

main {
  flex: 1;
}

h1,
h2,
h3,
.display {
  font-family: var(--font-display);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: -0.01em;
  margin: 0;
}

p {
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

::selection {
  background: var(--accent);
  color: var(--paper);
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}

.wrap {
  width: 100%;
  max-width: 72rem;
  margin-inline: auto;
  padding-inline: var(--gutter);
}

.meta {
  color: var(--ink-soft);
  font-size: 0.875rem;
}

/* Drawn underline: a resting rule line, the accent line grows over it. */
.link {
  background-image:
    linear-gradient(var(--accent), var(--accent)), linear-gradient(var(--rule), var(--rule));
  background-position:
    0 100%,
    0 100%;
  background-repeat: no-repeat;
  background-size:
    0 1px,
    100% 1px;
  padding-bottom: 2px;
  transition: background-size 0.5s var(--ease-out);
}

.link:hover,
.link:focus-visible {
  background-size:
    100% 1px,
    100% 1px;
}

.skip {
  position: absolute;
  left: var(--gutter);
  top: -3rem;
  padding: 0.5rem 0.75rem;
  background: var(--ink);
  color: var(--paper);
}

.skip:focus {
  top: 1rem;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  @view-transition {
    navigation: none;
  }
}
```

- [ ] **Step 3: `src/layouts/Base.astro`**

```astro
---
import { Font } from 'astro:assets';
import '../styles/global.css';
import { canonicalUrl } from '../lib/url';
import { personJsonLd, site } from '../site';

interface Props {
  title?: string;
  description?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown>[];
  header?: boolean;
}

const {
  title,
  description = site.description,
  type = 'website',
  jsonLd = [],
  header = true,
} = Astro.props;

const fullTitle = title ? `${title} | ${site.name}` : site.title;
const canonical = canonicalUrl(Astro.url.pathname, Astro.site!);
const ogImage = new URL('/og.png', Astro.site).href;
const year = new Date().getFullYear();
---

<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <meta name="theme-color" content="#F2EFE8" />
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <meta property="og:type" content={type} />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name" content={site.name} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <Font cssVariable="--font-display" preload />
    <Font cssVariable="--font-text" preload />
    {
      [personJsonLd, ...jsonLd].map(data => (
        <script type="application/ld+json" set:html={JSON.stringify(data)} />
      ))
    }
    <script
      is:inline
      defer
      src="https://cloud.umami.is/script.js"
      data-website-id="cddff34c-b72b-4f84-b155-b327edd3d634"></script>
  </head>
  <body>
    <a class="skip" href="#main">Aller au contenu</a>
    {
      header && (
        <header class="wrap site-header">
          <a class="display home" href="/">
            {site.name}
          </a>
          <nav aria-label="Principale">
            <a class="link" href="/projets">
              Projets
            </a>
            <a class="link" href="/blog">
              Blog
            </a>
          </nav>
        </header>
      )
    }
    <main id="main">
      <slot />
    </main>
    <footer class="wrap site-footer meta">
      <span>© {year} {site.name}</span>
      <nav aria-label="Réseaux">
        <a class="link" href={site.links.linkedin}>LinkedIn</a>
        <a class="link" href={site.links.github}>GitHub</a>
        <a class="link" href={site.links.malt}>Malt</a>
      </nav>
    </footer>
  </body>
</html>

<style>
  .site-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    padding-block: 1.75rem;
  }

  .home {
    font-size: 1.5rem;
  }

  .site-header nav,
  .site-footer nav {
    display: flex;
    gap: 1.25rem;
  }

  .site-footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
    padding-block: 2rem;
    border-top: 1px solid var(--rule);
    margin-top: 4rem;
  }
</style>
```

Before writing, confirm the `<Font>` component accepts `preload`: `grep -n "preload" node_modules/astro/components/Font.astro`. If the prop is absent, drop it.

- [ ] **Step 4: Use the layout on the placeholder home**

```astro
---
import Base from '../layouts/Base.astro';
---

<Base><p class="wrap">Victor Lenain</p></Base>
```

- [ ] **Step 5: Verify**

Run: `npm run check && npm run build && grep -o '<link rel="canonical"[^>]*>' dist/index.html`
Expected: `0 errors`; canonical `https://www.victorlenain.fr/`; `dist/_astro/fonts/` contains woff2 files.

- [ ] **Step 6: Commit**

```bash
git add src/site.ts src/styles/global.css src/layouts/Base.astro src/pages/index.astro
git commit -m "feat(ui): add the Papier & encre design tokens and base layout

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 4: Blog (collection, list, article)

**Files:**

- Move: `content/posts/*.mdx` → `src/content/posts/`
- Create: `src/content.config.ts`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`

**Interfaces:**

- Consumes: `publishedPosts`, `formatDate`, `Base.astro`, `site`.
- Produces: collection `posts` with `data: { title: string; summary: string; publishedAt: Date; tags: string[] }`, `id` = file name without extension.

- [ ] **Step 1: Move the posts**

```bash
mkdir -p src/content
git mv content/posts src/content/posts
```

- [ ] **Step 2: `src/content.config.ts`**

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts };
```

- [ ] **Step 3: `src/pages/blog/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import { formatDate, publishedPosts } from '../../lib/posts';

const posts = publishedPosts(await getCollection('posts'), new Date());
---

<Base
  title="Blog"
  description="Articles sur le développement web, l'intégration IA et le métier de freelance."
>
  <section class="wrap">
    <h1 class="page-title">Blog</h1>
    <ol class="posts">
      {
        posts.map(post => (
          <li>
            <a href={`/blog/${post.id}`}>
              <time class="meta" datetime={post.data.publishedAt.toISOString()}>
                {formatDate(post.data.publishedAt)}
              </time>
              <h2>{post.data.title}</h2>
              <p class="summary">{post.data.summary}</p>
            </a>
          </li>
        ))
      }
    </ol>
  </section>
</Base>

<style>
  .page-title {
    font-size: clamp(3rem, 9vw, 6rem);
    margin-block: 2rem 3rem;
  }

  .posts {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .posts li {
    border-top: 1px solid var(--rule);
  }

  .posts a {
    display: grid;
    gap: 0.4rem;
    padding-block: 1.75rem;
    max-width: var(--measure);
  }

  .posts h2 {
    font-size: clamp(1.6rem, 3.2vw, 2.25rem);
    transition:
      color 0.3s var(--ease-out),
      transform 0.5s var(--ease-out);
  }

  .posts a:hover h2,
  .posts a:focus-visible h2 {
    font-style: italic;
    color: var(--accent);
    transform: translateX(0.35rem);
  }

  .summary {
    color: var(--ink-soft);
  }
</style>
```

- [ ] **Step 4: `src/pages/blog/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import Base from '../../layouts/Base.astro';
import { formatDate, publishedPosts } from '../../lib/posts';
import { site } from '../../site';

export async function getStaticPaths() {
  const posts = publishedPosts(await getCollection('posts'), new Date());
  return posts.map(post => ({ params: { slug: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
const url = new URL(`/blog/${post.id}`, Astro.site).href;

const blogPosting = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.data.title,
  description: post.data.summary,
  datePublished: post.data.publishedAt.toISOString(),
  inLanguage: 'fr-FR',
  url,
  mainEntityOfPage: url,
  image: new URL('/og.png', Astro.site).href,
  author: { '@id': 'https://www.victorlenain.fr/#person', name: site.name },
  keywords: post.data.tags.join(', '),
};
---

<Base
  title={post.data.title}
  description={post.data.summary}
  type="article"
  jsonLd={[blogPosting]}
>
  <article class="wrap article">
    <header>
      <time class="meta" datetime={post.data.publishedAt.toISOString()}>
        {formatDate(post.data.publishedAt)}
      </time>
      <h1>{post.data.title}</h1>
    </header>
    <div class="prose">
      <Content />
    </div>
    <p class="back"><a class="link" href="/blog">← Tous les articles</a></p>
  </article>
</Base>

<style>
  .article {
    max-width: calc(var(--measure) + 2 * var(--gutter));
  }

  .article header {
    display: grid;
    gap: 1rem;
    margin-block: 2rem 3rem;
  }

  h1 {
    font-size: clamp(2.4rem, 6vw, 4rem);
  }

  .prose :global(h2) {
    font-size: 2rem;
    margin-block: 2.5rem 1rem;
  }

  .prose :global(h3) {
    font-size: 1.5rem;
    margin-block: 2rem 0.75rem;
  }

  .prose :global(p),
  .prose :global(ul),
  .prose :global(ol),
  .prose :global(blockquote),
  .prose :global(pre) {
    margin-block: 0 1.25rem;
  }

  .prose :global(a) {
    background-image:
      linear-gradient(var(--accent), var(--accent)), linear-gradient(var(--ink-soft), var(--ink-soft));
    background-position:
      0 100%,
      0 100%;
    background-repeat: no-repeat;
    background-size:
      0 1px,
      100% 1px;
    transition: background-size 0.5s var(--ease-out);
  }

  .prose :global(a:hover) {
    background-size:
      100% 1px,
      100% 1px;
  }

  .prose :global(blockquote) {
    padding-left: 1.25rem;
    border-left: 2px solid var(--accent);
    font-family: var(--font-display);
    font-size: 1.4rem;
    line-height: 1.35;
  }

  .prose :global(code) {
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 0.875em;
  }

  .prose :global(:not(pre) > code) {
    padding: 0.1em 0.3em;
    background: rgb(22 20 15 / 0.06);
  }

  .prose :global(pre) {
    padding: 1.25rem;
    overflow-x: auto;
    border: 1px solid var(--rule);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .prose :global(hr) {
    border: 0;
    border-top: 1px solid var(--rule);
    margin-block: 2.5rem;
  }

  .prose :global(img) {
    max-width: 100%;
    height: auto;
  }

  .back {
    margin-top: 3rem;
  }
</style>
```

In-text links use `--ink-soft` for the resting underline (not `--rule`) so they stay identifiable without colour (WCAG 1.4.1).

- [ ] **Step 5: Verify**

Run: `npm run check && npm run build && ls dist/blog/*.html | wc -l && ls dist/blog.html`
Expected: `0 errors`; `16`; `dist/blog.html` exists.
Open `npm run preview` → `/blog` and one article with a code block; code must be readable on the paper background.

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/pages/blog/index.astro 'src/pages/blog/[slug].astro' src/content/posts
git commit -m "feat(blog): serve the MDX posts from an Astro content collection

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 5: Home page with the entrance and index animations

**Files:**

- Modify: `src/pages/index.astro`

**Interfaces:**

- Consumes: `Base.astro` (`header={false}`), `site`.

- [ ] **Step 1: Write `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import { site } from '../site';

const words = site.name.split(' ');
const entries = [
  { label: 'Projets', href: '/projets', arrow: '→' },
  { label: 'Blog', href: '/blog', arrow: '→' },
  { label: 'Prendre rendez-vous', href: site.calUrl, arrow: '↗' },
  { label: 'Écrire', href: `mailto:${site.email}`, arrow: '↗' },
];
---

<Base header={false}>
  <section class="wrap hero">
    <h1 class="name" aria-label={site.name}>
      {
        words.map((word, i) => (
          <span class="mask" aria-hidden="true">
            <span class="word" style={`--i: ${i}`}>
              {word}
            </span>
          </span>
        ))
      }
    </h1>
    <p class="pitch">
      Développeur full-stack freelance à Paris. J'ajoute la couche IA (agents, RAG,
      automatisations) à votre produit existant, sans tout refaire.
    </p>
    <nav class="index" aria-label="Sommaire">
      <ul>
        {
          entries.map((entry, i) => (
            <li style={`--i: ${i}`}>
              <a href={entry.href}>
                <span class="label">{entry.label}</span>
                <span class="arrow" aria-hidden="true">
                  {entry.arrow}
                </span>
              </a>
            </li>
          ))
        }
      </ul>
    </nav>
  </section>
</Base>

<style>
  .hero {
    min-height: calc(100dvh - 6rem);
    display: grid;
    align-content: center;
    gap: clamp(1.5rem, 4vh, 2.75rem);
    padding-block: 3rem;
  }

  .name {
    font-size: clamp(3.5rem, 13vw, 9.5rem);
    line-height: 0.95;
    display: flex;
    flex-wrap: wrap;
    column-gap: 0.25em;
  }

  .mask {
    display: inline-block;
    overflow: clip;
    padding-bottom: 0.08em;
  }

  .word {
    display: inline-block;
    transform: translateY(105%);
    animation: rise 0.9s var(--ease-out) forwards;
    animation-delay: calc(0.1s + var(--i) * 0.09s);
  }

  .pitch {
    max-width: 38ch;
    font-size: clamp(1.1rem, 2vw, 1.35rem);
    color: var(--ink-soft);
    opacity: 0;
    animation: fade 0.8s var(--ease-out) 0.45s forwards;
  }

  .index ul {
    list-style: none;
    margin: 0;
    padding: 0;
    border-top: 1px solid var(--rule);
    max-width: 40rem;
  }

  .index li {
    border-bottom: 1px solid var(--rule);
    opacity: 0;
    animation: fade 0.7s var(--ease-out) forwards;
    animation-delay: calc(0.6s + var(--i) * 0.07s);
  }

  .index a {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-block: 0.7rem;
    font-family: var(--font-display);
    font-size: clamp(1.6rem, 3.4vw, 2.2rem);
    line-height: 1.2;
  }

  .label,
  .arrow {
    transition:
      color 0.3s var(--ease-out),
      transform 0.5s var(--ease-out);
  }

  .index a:hover .label,
  .index a:focus-visible .label {
    font-style: italic;
    color: var(--accent);
    transform: translateX(0.4rem);
  }

  .index a:hover .arrow,
  .index a:focus-visible .arrow {
    color: var(--accent);
    transform: translateX(0.4rem);
  }

  @keyframes rise {
    to {
      transform: translateY(0);
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
      transform: translateY(0.5rem);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
</style>
```

The global reduced-motion rule shortens every animation to 0.01ms with `forwards` fill, so content lands in its final state immediately.

- [ ] **Step 2: Verify**

Run: `npm run check && npm run build`
Expected: `0 errors`.
Run `npm run preview`, open `/` at 1440×900 and 375×667: name, pitch and the four index lines fit without scrolling; hover and keyboard focus both trigger the italic vermilion state; with DevTools « Emulate prefers-reduced-motion: reduce », everything is visible at once.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(home): one-screen home with name reveal and editorial index

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 6: Projects page and 404

**Files:**

- Create: `src/data/projects.ts`, `src/pages/projets.astro`, `src/pages/404.astro`

**Interfaces:**

- Produces: `projects: Project[]` with `type Project = { name: string; tagline: string; stack: string[]; url: string; status: 'En ligne' | 'En développement' }`.

- [ ] **Step 1: `src/data/projects.ts`**

```ts
export type Project = {
  name: string;
  tagline: string;
  stack: string[];
  url: string;
  status: 'En ligne' | 'En développement';
};

export const projects: Project[] = [
  {
    name: 'AubeSonore',
    tagline:
      'Web radio indépendante diffusée 24/7, dont la programmation est choisie chaque jour par un pipeline IA.',
    stack: ['TypeScript', 'Python', 'Docker'],
    url: 'https://www.aubesonore.fr/',
    status: 'En ligne',
  },
  {
    name: 'TomIA',
    tagline:
      'Tuteur IA aligné sur les programmes Éduscol, avec des réponses sourcées à chaque question.',
    stack: ['TypeScript', 'Python', 'Qdrant', 'Mistral'],
    url: 'https://www.tomia.fr/',
    status: 'En développement',
  },
];
```

- [ ] **Step 2: `src/pages/projets.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import { projects } from '../data/projects';
---

<Base title="Projets" description="Produits que je conçois et fais tourner en production.">
  <section class="wrap">
    <h1 class="page-title">Projets</h1>
    <ul class="projects">
      {
        projects.map(project => (
          <li>
            <a href={project.url}>
              <h2>
                {project.name}
                <span class="arrow" aria-hidden="true">
                  ↗
                </span>
              </h2>
              <p>{project.tagline}</p>
              <p class="meta">
                {project.status} · {project.stack.join(' · ')}
              </p>
            </a>
          </li>
        ))
      }
    </ul>
  </section>
</Base>

<style>
  .page-title {
    font-size: clamp(3rem, 9vw, 6rem);
    margin-block: 2rem 3rem;
  }

  .projects {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .projects li {
    border-top: 1px solid var(--rule);
  }

  .projects a {
    display: grid;
    gap: 0.5rem;
    padding-block: 2rem;
    max-width: var(--measure);
  }

  h2 {
    font-size: clamp(2.2rem, 6vw, 4rem);
    transition:
      color 0.3s var(--ease-out),
      transform 0.5s var(--ease-out);
  }

  .arrow {
    font-size: 0.5em;
    vertical-align: super;
  }

  .projects a:hover h2,
  .projects a:focus-visible h2 {
    font-style: italic;
    color: var(--accent);
    transform: translateX(0.4rem);
  }
</style>
```

- [ ] **Step 3: `src/pages/404.astro`**

```astro
---
import Base from '../layouts/Base.astro';
---

<Base title="Page introuvable">
  <section class="wrap lost">
    <h1>Cette page n'existe pas.</h1>
    <p><a class="link" href="/">Revenir à l'accueil</a></p>
  </section>
</Base>

<style>
  .lost {
    display: grid;
    gap: 1.5rem;
    padding-block: 6rem;
  }

  h1 {
    font-size: clamp(2.5rem, 7vw, 5rem);
  }
</style>
```

- [ ] **Step 4: Verify**

Run: `npm run check && npm run build && ls dist/projets.html dist/404.html`
Expected: `0 errors`, both files exist.

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.ts src/pages/projets.astro src/pages/404.astro
git commit -m "feat(projects): add the projects page and a 404

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 7: Static SEO assets and build verification

**Files:**

- Create: `public/robots.txt`, `public/manifest.webmanifest`, `scripts/og.mjs`, `public/og.png`, `scripts/verify-build.mjs`
- Modify: `public/llms.txt`

**Interfaces:**

- Consumes: the built `dist/` from Tasks 3–6.

- [ ] **Step 1: `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://www.victorlenain.fr/sitemap-index.xml
```

- [ ] **Step 2: `public/manifest.webmanifest`**

```json
{
  "name": "Victor Lenain",
  "short_name": "VL",
  "icons": [
    { "src": "/web-app-manifest-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/web-app-manifest-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "theme_color": "#F2EFE8",
  "background_color": "#F2EFE8",
  "display": "standalone"
}
```

- [ ] **Step 3: `scripts/og.mjs` and generate `public/og.png`**

```js
// One-off generator for public/og.png. Run:
// npx -y -p satori@0.33 -p @resvg/resvg-js node scripts/og.mjs
import { Resvg } from '@resvg/resvg-js';
import { writeFile } from 'node:fs/promises';
import satori from 'satori';

const fontUrl =
  'https://github.com/google/fonts/raw/main/ofl/instrumentserif/InstrumentSerif-Regular.ttf';
const font = Buffer.from(await (await fetch(fontUrl)).arrayBuffer());

const text = (fontSize, color, children, extra = {}) => ({
  type: 'div',
  props: { style: { fontSize, color, lineHeight: 1, ...extra }, children },
});

const svg = await satori(
  {
    type: 'div',
    props: {
      style: {
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 80,
        background: '#F2EFE8',
        fontFamily: 'Instrument Serif',
      },
      children: [
        text(150, '#16140F', 'Victor Lenain'),
        text(44, '#E4412B', 'Développeur full-stack · Intégration IA · Paris', { marginTop: 24 }),
      ],
    },
  },
  {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Instrument Serif', data: font, weight: 400, style: 'normal' }],
  },
);

await writeFile('public/og.png', new Resvg(svg).render().asPng());
```

`npx -p` packages are not resolvable by a bare `import` from a project file, so run it from a throwaway directory instead:

```bash
T=$(mktemp -d) && cp scripts/og.mjs "$T" && (cd "$T" && npm init -y >/dev/null && npm i --silent satori@0.33 @resvg/resvg-js && mkdir public && node og.mjs) && cp "$T/public/og.png" public/og.png
file public/og.png
```

Expected: `PNG image data, 1200 x 630`. Look at it (Read tool) before committing.

- [ ] **Step 4: Update `public/llms.txt`**

- Replace every `https://victorlenain.fr` with `https://www.victorlenain.fr`.
- Replace the `## Services` list items: drop the `[…](…/#services)` link syntax, keep the text after the colon, prefixed by the service name.
- In `## Stack technique`, change `Next.js 15` to `Next.js, Astro`.
- In `## Blog`, rebuild the list from all published posts: `- [<title>](https://www.victorlenain.fr/blog/<slug>)`, newest first.

- [ ] **Step 5: `scripts/verify-build.mjs`**

```js
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
```

- [ ] **Step 6: Run and check it fails when it should**

Run: `npm run build && npm run verify:build`
Expected: `verify-build: ok (16 posts)`.
Then prove it can fail: `mv dist/projets.html dist/projets.bak && npm run verify:build; echo "exit=$?"; mv dist/projets.bak dist/projets.html`
Expected: `missing dist/projets.html`, `exit=1`.

- [ ] **Step 7: Commit**

```bash
git add public/robots.txt public/manifest.webmanifest public/og.png public/llms.txt scripts/og.mjs scripts/verify-build.mjs
git commit -m "feat(seo): add static SEO assets, OG image and post-build checks

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 8: Project docs and full validation

**Files:**

- Modify: `CLAUDE.md`

- [ ] **Step 1: Rewrite `CLAUDE.md`**

```markdown
# CLAUDE.md

Instructions pour Claude Code sur ce repository.

## Commandes

- `npm install` — dépendances (Node ≥ 22.12)
- `npm run dev` — serveur de développement
- `npm run build` — build statique dans `dist/`
- `npm run verify:build` — assertions sur `dist/` (articles, sitemap, canonicals)
- `npm run check` — `astro check` (types `.astro` et TS)
- `npm test` — Vitest sur `src/lib`
- `npm run format` / `npm run format:check` — Prettier

## Architecture

Site statique Astro 7 déployé sur Vercel (`vercel.json` : framework, URLs sans
`.html` ni slash final, 301 des anciennes pages `/services`).

- `src/pages/` — `/`, `/projets`, `/blog`, `/blog/[slug]`, 404
- `src/layouts/Base.astro` — `<head>`, SEO, JSON-LD, header, footer
- `src/content/posts/*.mdx` — articles ; `publishedAt` dans le futur = non publié
- `src/data/projects.ts` — projets affichés
- `src/lib/` — seule logique du site, testée
- `src/styles/global.css` — tokens de la charte « Papier & encre »

## Règles

- Aucun JS client hors Umami. Les animations sont en CSS et respectent
  `prefers-reduced-motion`.
- Le vermillon `--accent` ne colore jamais du texte courant (contraste 3.59:1).
- Wording orienté valeur client, pas liste de technos.
- `public/og.png` se régénère avec `scripts/og.mjs` (voir l'en-tête du script).
```

- [ ] **Step 2: Full validation**

Run each and read the exit code:

```bash
npm run format:check; echo "format=$?"
npm run check; echo "check=$?"
npm test; echo "test=$?"
npm run build; echo "build=$?"
npm run verify:build; echo "verify=$?"
```

Expected: all `0`. Fix causes, not symptoms (run `npm run format` only for formatting diffs).

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: describe the Astro project in CLAUDE.md

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Task 9: Preview deployment and PR

- [ ] **Step 1: Push and open the PR**

```bash
git push -u origin feat/astro-rebuild
gh pr create --base master --title "feat: rebuild the site with Astro (Papier & encre)" --body "<summary of spec, validation results>

Generated with Claude Code"
```

- [ ] **Step 2: Wait for the Vercel preview**

Run: `gh pr checks <n> --watch --interval 20`
Expected: `Vercel pass`. On failure: `vercel inspect <deployment> --logs`, find the root cause before changing anything.

- [ ] **Step 3: Check the preview over HTTP**

With `P=<preview url>`:

```bash
curl -sI $P/services/agents-ia | grep -iE '^HTTP|^location'   # 301, location /
curl -sI $P/services | grep -iE '^HTTP|^location'             # 301, location /
curl -sI $P/blog/2026-04-09-react-server-components-production | head -1   # 200
curl -sI $P/blog/2026-04-09-react-server-components-production/ | grep -iE '^HTTP|^location'  # 308 to no slash
curl -sI $P/blog.html | grep -iE '^HTTP|^location'           # 308 to /blog
curl -sI $P/nope | head -1                                     # 404
```

Preview deployments may sit behind Vercel Authentication; if curl gets 401, use the Chrome tools on the logged-in browser instead.

- [ ] **Step 4: Visual and Lighthouse pass in Chrome**

Open `/`, `/projets`, `/blog`, one article at desktop and 375px wide. Run Lighthouse (mobile): Accessibility 100, SEO 100 (preview pages carry `noindex` from Vercel, so judge SEO on everything except that audit), Performance ≥ 95. Fix what fails, re-run Task 8 Step 2, commit, push.

- [ ] **Step 5: Propose the merge method**

Report the PR link and validation results; propose merge commit (each task commit stands alone). Merge only after explicit approval.
