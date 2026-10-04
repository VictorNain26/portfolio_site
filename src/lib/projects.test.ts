import { describe, expect, it } from 'vitest';
import { projectsFrom } from './projects';

const repo = (extra: Record<string, unknown> = {}) => ({
  name: 'aubesonore',
  description: 'AubeSonore — Web radio diffusée 24 h/24.',
  url: 'https://github.com/VictorNain26/aubesonore',
  homepage: null,
  topics: ['portfolio', 'python'],
  archived: false,
  pushedAt: '2026-10-03',
  ...extra,
});

describe('projectsFrom', () => {
  it('splits the description into name and tagline, and keeps the other topics as stack', () => {
    expect(projectsFrom([repo()])).toEqual([
      {
        name: 'AubeSonore',
        tagline: 'Web radio diffusée 24 h/24.',
        stack: ['python'],
        url: 'https://github.com/VictorNain26/aubesonore',
        status: 'Sur GitHub',
        updatedAt: new Date('2026-10-03T00:00:00Z'),
      },
    ]);
  });

  it('shows only the repos tagged portfolio', () => {
    expect(projectsFrom([repo({ topics: ['python'] })])).toEqual([]);
  });

  it('links the homepage and calls the project online when it has one', () => {
    const [project] = projectsFrom([repo({ homepage: 'https://aubesonore.fr/' })]);
    expect(project).toMatchObject({ url: 'https://aubesonore.fr/', status: 'En ligne' });
  });

  it('reads the pre-launch status from its topic, before the homepage', () => {
    const [project] = projectsFrom([
      repo({ homepage: 'https://www.tomia.fr/', topics: ['portfolio', 'pre-launch', 'nextjs'] }),
    ]);
    expect(project).toMatchObject({ status: 'Pré-lancement', stack: ['nextjs'] });
  });

  it('shows an archived repo as archived, after the others', () => {
    const projects = projectsFrom([
      repo({ name: 'tomai-curriculum', description: 'Index RAG — Retiré.', archived: true }),
      repo({ homepage: 'https://aubesonore.fr/' }),
    ]);
    expect(projects.map(project => [project.name, project.status])).toEqual([
      ['AubeSonore', 'En ligne'],
      ['Index RAG', 'Archivé'],
    ]);
  });

  it('keeps a dash inside the tagline', () => {
    const [project] = projectsFrom([repo({ description: 'TomIA — Tuteur — pour collégiens.' })]);
    expect(project).toMatchObject({ name: 'TomIA', tagline: 'Tuteur — pour collégiens.' });
  });

  it.each([
    ['Web radio diffusée 24 h/24.', 'Web radio diffusée 24 h/24.'],
    [' — Sans nom.', '— Sans nom.'],
    [null, ''],
  ])('names it after the repo when the description %j has no name', (description, tagline) => {
    expect(projectsFrom([repo({ description })])[0]).toMatchObject({
      name: 'aubesonore',
      tagline,
    });
  });
});
