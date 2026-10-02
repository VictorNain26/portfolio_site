import type { Document } from './knowledge';

export type Source = { title: string; url: string };

const MAX_SOURCES = 4;
// Three shared word trigrams, each with a word of five letters or more: enough to tie a
// paraphrase to its post ("au Wagon à l'été 2021"), not enough for stock phrases.
const MIN_SHARED = 3;

const tokens = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const trigrams = (list: string[]) =>
  new Set(
    list
      .slice(2)
      .map((_, i) => list.slice(i, i + 3))
      .filter(gram => gram.some(word => word.length >= 5))
      .map(gram => gram.join(' ')),
  );

const named = (answer: string, name: string) =>
  ` ${answer} `.includes(` ${tokens(name).join(' ')} `);

export function citedSources(answer: string, documents: Document[], readRepos: string[]): Source[] {
  const words = tokens(answer);
  const text = words.join(' ');
  const grams = trigrams(words);
  const cited = documents.filter(
    doc =>
      readRepos.includes(doc.id) ||
      doc.names.some(name => named(text, name)) ||
      [...trigrams(tokens(doc.text))].filter(gram => grams.has(gram)).length >= MIN_SHARED,
  );
  // A repo named like a cited project (AubeSonore) adds nothing unless its README was read.
  const projects = new Set(
    cited.filter(doc => doc.id.startsWith('project:')).map(doc => tokens(doc.title).join(' ')),
  );
  return cited
    .filter(
      doc =>
        !doc.id.startsWith('repo:') ||
        readRepos.includes(doc.id) ||
        !projects.has(tokens(doc.names[0]!).join(' ')),
    )
    .slice(0, MAX_SOURCES)
    .map(({ title, url }) => ({ title, url }));
}
