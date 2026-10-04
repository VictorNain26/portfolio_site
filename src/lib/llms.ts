import type { Project } from './projects';
import { formatDate } from './posts';

export type LlmsPost = { slug: string; title: string; summary: string };

// What Victor wrote about himself in the agent's persona: one source for both.
export function personaFacts(persona: string): string {
  const section = persona.split(/^## /m).find(part => part.startsWith('Qui je suis'));
  if (!section) throw new Error('persona.md has no "## Qui je suis" section');
  return section.slice(section.indexOf('\n') + 1).trim();
}

// https://llmstxt.org: H1, blockquote summary, free text, then H2 sections of links.
export function llmsTxt({
  name,
  description,
  persona,
  email,
  projects,
  posts,
  links,
  siteUrl,
}: {
  name: string;
  description: string;
  persona: string;
  email: string;
  projects: Project[];
  posts: LlmsPost[];
  links: { blog: string; github: string; linkedin: string };
  siteUrl: string;
}): string {
  const url = (path: string) => new URL(path, siteUrl).href;
  const section = (title: string, items: string[]) => `## ${title}\n\n${items.join('\n')}`;
  const sections = [
    `# ${name}`,
    `> ${description}`,
    personaFacts(persona),
    `Contact : ${email}`,
    section(
      'Projets',
      projects.map(
        project =>
          `- [${project.name}](${project.url}): ${[project.tagline, `Statut : ${project.status}.`, project.stack.length > 0 && `Stack : ${project.stack.join(', ')}.`].filter(Boolean).join(' ')}`,
      ),
    ),
    posts.length > 0 &&
      section(
        'Articles',
        posts.map(post => `- [${post.title}](${url(`/blog/${post.slug}.md`)}): ${post.summary}`),
      ),
    section('Optional', [
      `- [Blog](${url('/blog')}): ${links.blog}`,
      `- [Flux RSS](${url('/rss.xml')})`,
      `- [GitHub](${links.github}): dépôts publics`,
      `- [LinkedIn](${links.linkedin})`,
    ]),
  ];
  return `${sections.filter(Boolean).join('\n\n')}\n`;
}

// The Markdown twin of a post page, as llms.txt proposes: same URL with `.md`.
export function postMarkdown({
  title,
  summary,
  publishedAt,
  author,
  url,
  body,
}: {
  title: string;
  summary: string;
  publishedAt: Date;
  author: string;
  url: string;
  body: string;
}): string {
  return `# ${title}\n\n> ${summary}\n\nPublié le ${formatDate(publishedAt)} par ${author} : ${url}\n\n${body.trim()}\n`;
}
