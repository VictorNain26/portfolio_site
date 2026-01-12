import { defineCollection, defineConfig } from '@content-collections/core';
import { compileMDX } from '@content-collections/mdx';
import { z } from 'zod';

/* ---------------- Collection posts ---------------- */
const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    coverImage: z.string().regex(/^\/images\/.+\.(jpg|jpeg|png|webp|avif)$/i).optional(),
    publishedAt: z.string(),
    tags: z.array(z.string()).default([]),
  }),

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
