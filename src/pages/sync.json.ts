import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import github from '../data/github.json?raw';
import { staleAt } from '../lib/sync';

// What this build was made from, read by .github/workflows/sync.yml to rebuild only when GitHub
// or the year has turned.
export const GET = (() =>
  Response.json({
    github: createHash('sha256').update(github).digest('hex'),
    staleAt: staleAt(new Date()),
  })) satisfies APIRoute;
