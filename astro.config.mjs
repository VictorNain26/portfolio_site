import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeExternalLinks from 'rehype-external-links';
import { readdirSync, readFileSync } from 'node:fs';

// Shiki tokens that fall under 4.5:1 on their paper, adjusted to pass AA.
const tokenColors = {
  color: {
    '#6A737D': '#5E594F',
    '#D73A49': '#B8323D',
    '#E36209': '#A84B06',
    '#22863A': '#1A7532',
  },
  '--shiki-dark': { '#6A737D': '#A8A193' },
};
const recolor = style =>
  String(style ?? '')
    .split(';')
    .map(declaration => {
      const [property, value] = declaration.split(':');
      const to = tokenColors[property]?.[value?.toUpperCase()];
      return to ? `${property}:${to}` : declaration;
    })
    .join(';');

const postsDir = './src/content/posts';
const publishedAt = new Map(
  readdirSync(postsDir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => [
      `/blog/${file.replace(/\.mdx$/, '')}`,
      readFileSync(`${postsDir}/${file}`, 'utf8').match(/^publishedAt:\s*['"]?([^'"\n]+)/m)?.[1],
    ]),
);

export default defineConfig({
  site: 'https://www.victorlenain.fr',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        const date = publishedAt.get(new URL(item.url).pathname);
        return date ? { ...item, lastmod: new Date(date).toISOString() } : item;
      },
    }),
  ],
  markdown: {
    processor: unified({
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            target: '_blank',
            rel: ['noopener'],
            content: { type: 'text', value: ' (nouvel onglet)' },
            contentProperties: { className: ['sr-only'] },
          },
        ],
      ],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      transformers: [
        {
          // Let code blocks sit on the paper instead of github-light's white box.
          pre(node) {
            node.properties.style = String(node.properties.style ?? '').replace(
              /(background-color|--shiki-dark-bg):[^;]+;?/g,
              '',
            );
          },
          span(node) {
            node.properties.style = recolor(node.properties.style);
          },
        },
      ],
    },
  },
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
