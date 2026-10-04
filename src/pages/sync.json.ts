import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { createHash } from 'node:crypto';
import github from '../data/github.json?raw';
import { staleAt } from '../lib/sync';

// What this build was made from, read by .github/workflows/sync.yml to rebuild only when GitHub
// or the calendar has moved on.
export const GET = (async () =>
  Response.json({
    github: createHash('sha256').update(github).digest('hex'),
    staleAt: staleAt(
      (await getCollection('posts')).map(post => post.data.publishedAt),
      new Date(),
    ),
  })) satisfies APIRoute;
