import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import persona from '../content/persona.md?raw';
import { projects } from '../data/projects';
import { llmsTxt } from '../lib/llms';
import { publishedPosts } from '../lib/posts';
import { site } from '../site';

export const GET = (async context => {
  const posts = publishedPosts(await getCollection('posts'), new Date());
  return new Response(
    llmsTxt({
      name: site.name,
      description: site.description,
      persona,
      email: site.email,
      projects,
      posts: posts.map(post => ({
        slug: post.id,
        title: post.data.title,
        summary: post.data.summary,
      })),
      links: { blog: site.blog.description, ...site.links },
      siteUrl: context.site!.href,
    }),
    { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } },
  );
}) satisfies APIRoute;
