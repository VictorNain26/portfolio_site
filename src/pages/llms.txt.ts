import type { APIRoute } from 'astro';
import persona from '../content/persona.md?raw';
import { projects } from '../data/projects';
import { llmsTxt } from '../lib/llms';
import { site } from '../site';

export const GET = (() =>
  new Response(
    llmsTxt({
      name: site.name,
      description: site.description,
      persona,
      email: site.email,
      projects,
      links: site.links,
    }),
    { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } },
  )) satisfies APIRoute;
