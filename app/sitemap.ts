import type { MetadataRoute } from 'next';
import { allPosts } from 'content-collections';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://victorlenain.fr';

  // Pages statiques principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Articles de blog publiés (exclure les articles programmés dans le futur)
  const now = new Date();
  const blogPosts: MetadataRoute.Sitemap = allPosts.filter((post) => new Date(post.publishedAt) <= now).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPosts];
}
