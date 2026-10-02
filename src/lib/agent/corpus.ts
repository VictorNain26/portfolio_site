import { parseFrontmatter } from '@astrojs/markdown-remark';
import { z } from 'astro/zod';
import persona from '../../content/persona.md?raw';
import github from '../../data/github.json';
import { projects } from '../../data/projects';
import type { Knowledge, Post } from './knowledge';
import { reposSchema } from './repos';

const frontmatterSchema = z.object({
  title: z.string(),
  summary: z.string(),
  publishedAt: z.coerce.date(),
});

const files = import.meta.glob<string>('../../content/posts/*.mdx', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const posts: Post[] = Object.entries(files).map(([path, raw]) => {
  const { frontmatter, content } = parseFrontmatter(raw);
  return {
    slug: path.slice(path.lastIndexOf('/') + 1, -'.mdx'.length),
    ...frontmatterSchema.parse(frontmatter),
    body: content.trim(),
  };
});

export const knowledge: Knowledge = { persona, projects, posts, repos: reposSchema.parse(github) };
