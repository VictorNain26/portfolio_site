import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// github-light tokens that fall under 4.5:1 on the #F2EFE8 paper, darkened to pass AA.
const tokenColors = {
  '#6A737D': '#5E594F',
  '#D73A49': '#B8323D',
  '#E36209': '#A84B06',
  '#22863A': '#1A7532',
};
const recolor = style =>
  Object.entries(tokenColors).reduce(
    (out, [from, to]) => out.replaceAll(new RegExp(from, 'gi'), to),
    String(style ?? ''),
  );

export default defineConfig({
  site: 'https://www.victorlenain.fr',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      transformers: [
        {
          // Let code blocks sit on the paper instead of github-light's white box.
          pre(node) {
            node.properties.style = String(node.properties.style ?? '').replace(
              /background-color:[^;]+;?/,
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
