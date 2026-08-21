import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import { z } from 'zod';

/* ---------------- Collection posts ---------------- */
export const postsSchema = z.object({
  title: z.string(),
  summary: z.string(),
  publishedAt: z.iso.date(),
  tags: z.array(z.string()).default([]),
});

const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '**/*.mdx',
  schema: postsSchema,

  /* -----  transform : slug + compilation MDX  ----- */
  transform: async (doc, ctx) => {
    const mdx = await compileMDX(ctx, doc);
    return {
      ...doc,
      slug: doc._meta.fileName.replace(/\.mdx?$/, ''),
      mdx,
    };
  },
});

/* ---------------- Config globale ------------------ */
export default defineConfig({
  collections: [posts],
});
