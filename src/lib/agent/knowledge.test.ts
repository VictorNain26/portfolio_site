import { describe, expect, it } from 'vitest';
import { checkBudget, documentsOf } from './knowledge';
import type { Repo } from './repos';

const repo = (name: string, extra: Partial<Repo> = {}): Repo => ({
  name,
  description: null,
  url: `https://github.com/VictorNain26/${name}`,
  homepage: null,
  language: null,
  stars: 0,
  pushedAt: '2026-09-01',
  archived: false,
  topics: ['portfolio'],
  readme: null,
  ...extra,
});

const aubesonore = repo('aubesonore', {
  description: 'AubeSonore — Web radio diffusée 24 h/24.',
  homepage: 'https://www.aubesonore.fr/',
  topics: ['portfolio', 'python'],
  language: 'Python',
  // As src/lib/github.ts writes it: plain text, already cut.
  readme: 'AubeSonore\n\nDiffuse via AzuraCast, le dimanche.',
});
const profile = repo('VictorNain26', { topics: [], readme: 'Salut, je suis Victor.' });

describe('documentsOf', () => {
  const documents = documentsOf([aubesonore, profile]);
  const project = documents.find(doc => doc.id === 'project:aubesonore')!;

  it('makes one document per project, named by the project and by its repo', () => {
    expect(project).toMatchObject({
      title: 'AubeSonore',
      url: 'https://www.aubesonore.fr/',
      names: ['AubeSonore', 'aubesonore'],
    });
  });

  it('carries the status, the stack and the README', () => {
    expect(project.text).toContain('En ligne');
    expect(project.text).toContain('Web radio diffusée 24 h/24.');
    expect(project.text).toContain('python');
    expect(project.text).toContain('Diffuse via AzuraCast, le dimanche.');
  });

  it('gives the main language GitHub reports', () => {
    expect(project.text).toContain('Langage : Python.');
  });

  it('keeps the profile README as its own document', () => {
    expect(documents.find(doc => doc.id === 'profile')).toMatchObject({
      url: 'https://github.com/VictorNain26/VictorNain26',
      names: ['VictorNain26'],
      text: expect.stringContaining('Salut, je suis Victor.'),
    });
  });
});

describe('checkBudget', () => {
  const doc = (text: string) => ({ id: 'x', title: 'X', url: 'https://x', names: ['X'], text });

  it('passes a corpus within the budget', () => {
    expect(() => checkBudget('fiche', [doc('a'.repeat(100))], 1_000)).not.toThrow();
  });

  it('fails the build when the corpus outgrows it', () => {
    expect(() => checkBudget('fiche', [doc('a'.repeat(600)), doc('b'.repeat(600))], 1_000)).toThrow(
      /corpus/,
    );
  });
});
