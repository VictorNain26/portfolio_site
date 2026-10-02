import { describe, expect, it } from 'vitest';
import { projectsFrom } from './projects';

const repo = (extra: Record<string, unknown> = {}) => ({
  name: 'aubesonore',
  description: 'AubeSonore — Web radio diffusée 24 h/24.',
  url: 'https://github.com/VictorNain26/aubesonore',
  homepage: null,
  topics: ['portfolio', 'python'],
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
        status: 'Open source',
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

  it('keeps a dash inside the tagline', () => {
    const [project] = projectsFrom([repo({ description: 'TomIA — Tuteur — pour collégiens.' })]);
    expect(project).toMatchObject({ name: 'TomIA', tagline: 'Tuteur — pour collégiens.' });
  });

  it.each([null, 'Web radio sans nom.', ' — Sans nom.'])(
    'fails the build on the description %j',
    description => {
      expect(() => projectsFrom([repo({ description })])).toThrow('aubesonore');
    },
  );
});
