import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { publishedPosts } from '../lib/posts';
import { site } from '../site';

export async function GET(context: APIContext) {
  const posts = publishedPosts(await getCollection('posts'), new Date());
  return rss({
    title: site.blog.title,
    description: site.blog.description,
    site: context.site!,
    customData: '<language>fr-FR</language>',
    trailingSlash: false,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.data.summary,
      link: `/blog/${post.id}`,
      categories: post.data.tags,
    })),
  });
}
