import { defineConfig, envField, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.victorlenain.fr',
  trailingSlash: 'never',
  adapter: vercel({ maxDuration: 60 }),
  env: {
    schema: {
      MISTRAL_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      VISITOR_SECRET: envField.string({ context: 'server', access: 'secret' }),
      KV_REST_API_URL: envField.string({ context: 'server', access: 'secret' }),
      KV_REST_API_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      LANGFUSE_PUBLIC_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      LANGFUSE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      LANGFUSE_BASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  integrations: [sitemap()],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Newsreader',
      cssVariable: '--font-serif',
      weights: ['200 800'],
      styles: ['normal', 'italic'],
      fallbacks: ['Georgia', 'serif'],
    },
  ],
});
