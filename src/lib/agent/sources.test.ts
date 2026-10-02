import { describe, expect, it } from 'vitest';
import type { Document } from './knowledge';
import { citedSources } from './sources';

const doc = (id: string, name: string, text = ''): Document => ({
  id,
  title: name,
  url: `https://example.com/${id}`,
  names: [name],
  text,
});

const aubesonore = doc('project:aubesonore', 'AubeSonore', 'Web radio diffusée 24 h/24.');
const aubesonoreRepo = doc('repo:AubeSonore', 'AubeSonore');
const pipeline = doc('repo:radio-pipeline', 'radio-pipeline');
const post = doc(
  'post:qui-je-suis',
  'Salut, moi c’est Victor',
  'Je n’ai pas appris à coder à l’école. J’ai fait le Wagon à l’été 2021, trois mois où l’on code dès le premier matin.',
);
const documents = [aubesonore, post, aubesonoreRepo, pipeline];
const titles = (answer: string, read: string[] = []) =>
  citedSources(answer, documents, read).map(source => source.title);

describe('citedSources', () => {
  it('cites a project named in the answer, accents and case aside', () => {
    expect(titles('Sur AUBESONORE, la radio tourne seule.')).toEqual(['AubeSonore']);
  });

  it('matches a hyphenated repo name written with spaces', () => {
    expect(titles('Le dépôt radio pipeline remplit l’antenne.')).toEqual(['radio-pipeline']);
  });

  it('ties a paraphrase to the post it comes from', () => {
    expect(
      titles('J’ai fait le Wagon à l’été 2021 : trois mois où l’on code dès le premier matin.'),
    ).toEqual(['Salut, moi c’est Victor']);
  });

  it('does not cite a post for a stock phrase it shares', () => {
    expect(titles('Je n’ai pas appris ça ici, écris-moi.')).toEqual([]);
  });

  it('keeps the project and drops its same-name repo, unless the README was read', () => {
    expect(titles('AubeSonore diffuse en continu.')).toEqual(['AubeSonore']);
    expect(titles('AubeSonore diffuse en continu.', ['repo:AubeSonore'])).toEqual([
      'AubeSonore',
      'AubeSonore',
    ]);
  });

  it('cites a README read by a tool even when the answer does not name it', () => {
    expect(
      titles('Il découvre de nouveaux morceaux chaque jour.', ['repo:radio-pipeline']),
    ).toEqual(['radio-pipeline']);
  });
});
