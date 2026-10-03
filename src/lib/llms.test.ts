import { describe, expect, it } from 'vitest';
import type { Project } from './projects';
import { llmsTxt, personaFacts, postMarkdown } from './llms';

const persona = `# Fiche

Écrite par Victor.

## Qui je suis

- Développeur à Paris.
- Appris au Wagon.

## Sujets dont je ne parle pas ici

- tarifs.
`;

const project: Project = {
  name: 'AubeSonore',
  tagline: 'Web radio.',
  stack: ['Python', 'Docker'],
  url: 'https://www.aubesonore.fr/',
  status: 'En ligne',
};

const input = {
  name: 'Victor Lenain',
  description: 'Développeur à Paris.',
  persona,
  email: 'v@example.com',
  projects: [project],
  posts: [{ slug: '2026-09-22-qui-je-suis', title: 'Salut', summary: 'Qui je suis.' }],
  links: {
    blog: 'Ce que je retiens.',
    github: 'https://github.com/VictorNain26',
    linkedin: 'https://www.linkedin.com/in/victorlenain/',
  },
  siteUrl: 'https://www.victorlenain.fr',
};

describe('personaFacts', () => {
  it('keeps only the "Qui je suis" section', () => {
    expect(personaFacts(persona)).toBe('- Développeur à Paris.\n- Appris au Wagon.');
  });

  it('fails the build when the section is gone', () => {
    expect(() => personaFacts('# Fiche\n\n## Autre\n')).toThrow('Qui je suis');
  });
});

describe('llmsTxt', () => {
  const text = llmsTxt(input);

  it('follows the llms.txt layout: H1, blockquote, then H2 link lists', () => {
    expect(text.startsWith('# Victor Lenain\n\n> Développeur à Paris.\n\n- Développeur')).toBe(
      true,
    );
    expect(text.match(/^## .+$/gm)).toEqual(['## Projets', '## Articles', '## Optional']);
  });

  it('lists projects with status and stack, and posts by their Markdown URL', () => {
    const line = text.split('\n').find(row => row.startsWith('- [AubeSonore]'));
    expect(line).toMatch(/^- \[AubeSonore\]\(https:\/\/www\.aubesonore\.fr\/\): Web radio\./);
    expect(line).toContain('En ligne');
    expect(line).toContain('Python, Docker');
    expect(text).toContain('[Salut](https://www.victorlenain.fr/blog/2026-09-22-qui-je-suis.md)');
  });

  it('never carries the topics the persona keeps off the site', () => {
    expect(text).not.toContain('tarifs');
  });

  it('drops the Articles section when nothing is published', () => {
    expect(llmsTxt({ ...input, posts: [] })).not.toContain('## Articles');
  });
});

describe('postMarkdown', () => {
  it('heads the body with title, summary, date and page URL', () => {
    const markdown = postMarkdown({
      title: 'Salut',
      summary: 'Qui je suis.',
      publishedAt: new Date('2026-09-22'),
      author: 'Victor Lenain',
      url: 'https://www.victorlenain.fr/blog/salut',
      body: '\nPendant longtemps…\n',
    });
    expect(markdown.startsWith('# Salut\n\n> Qui je suis.\n\n')).toBe(true);
    expect(markdown).toContain('22 septembre 2026');
    expect(markdown).toContain('https://www.victorlenain.fr/blog/salut');
    expect(markdown.endsWith('\n\nPendant longtemps…\n')).toBe(true);
  });
});
