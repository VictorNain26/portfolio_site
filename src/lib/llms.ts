import type { Project } from './projects';

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
  links,
}: {
  name: string;
  description: string;
  persona: string;
  email: string;
  projects: Project[];
  links: { github: string; linkedin: string };
}): string {
  const section = (title: string, items: string[]) => `## ${title}\n\n${items.join('\n')}`;
  const sections = [
    `# ${name}`,
    `> ${description}`,
    personaFacts(persona),
    `Contact : ${email}`,
    section(
      'Projets',
      projects.map(project => {
        const details = [
          project.tagline,
          `Statut : ${project.status}.`,
          project.stack.length > 0 && `Stack : ${project.stack.join(', ')}.`,
          project.repo !== project.url && `Code : ${project.repo}`,
        ];
        return `- [${project.name}](${project.url}): ${details.filter(Boolean).join(' ')}`;
      }),
    ),
    section('Optional', [
      `- [GitHub](${links.github}): dépôts publics`,
      `- [LinkedIn](${links.linkedin})`,
    ]),
  ];
  return `${sections.filter(Boolean).join('\n\n')}\n`;
}
