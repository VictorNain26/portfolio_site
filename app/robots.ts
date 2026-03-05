import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://victorlenain.fr';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
      // Autoriser explicitement les crawlers IA pour le GEO (2026)
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'Amazonbot',
        allow: '/',
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
      },
      {
        userAgent: 'Meta-ExternalAgent',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
