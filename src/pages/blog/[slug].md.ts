import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { getCollection } from 'astro:content';
import { postMarkdown } from '../../lib/llms';
import { publishedPosts } from '../../lib/posts';
import { site } from '../../site';

export const getStaticPaths = (async () => {
  const posts = publishedPosts(await getCollection('posts'), new Date());
  return posts.map(post => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET = (({ props: { post }, site: siteUrl }) =>
  new Response(
    postMarkdown({
      title: post.data.title,
      summary: post.data.summary,
      publishedAt: post.data.publishedAt,
      author: site.name,
      url: new URL(`/blog/${post.id}`, siteUrl).href,
      body: post.body ?? '',
    }),
    { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } },
  )) satisfies APIRoute<InferGetStaticPropsType<typeof getStaticPaths>>;
