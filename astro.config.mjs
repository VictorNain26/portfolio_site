import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { parseFrontmatter, unified } from '@astrojs/markdown-remark';
import githubDark from '@shikijs/themes/github-dark';
import githubLight from '@shikijs/themes/github-light';
import rehypeExternalLinks from 'rehype-external-links';
import { readdirSync, readFileSync } from 'node:fs';

const postsDir = './src/content/posts';
const publishedAt = new Map(
  readdirSync(postsDir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => [
      `/blog/${file.replace(/\.mdx$/, '')}`,
      parseFrontmatter(readFileSync(`${postsDir}/${file}`, 'utf8')).frontmatter.publishedAt,
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
      // Shiki tokens that fall under 4.5:1 on their paper, adjusted to pass AA.
      themes: {
        light: {
          ...githubLight,
          colorReplacements: {
            '#6a737d': '#5e594f',
            '#d73a49': '#b8323d',
            '#e36209': '#a84b06',
            '#22863a': '#1a7532',
          },
        },
        dark: { ...githubDark, colorReplacements: { '#6a737d': '#a8a193' } },
      },
      transformers: [
        {
          // Let code blocks sit on the paper instead of github-light's white box.
          pre(node) {
            node.properties.style = String(node.properties.style ?? '').replace(
              /(background-color|--shiki-dark-bg):[^;]+;?/g,
              '',
            );
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
