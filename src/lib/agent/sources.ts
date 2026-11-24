import type { Document } from './knowledge';

export type Source = { title: string; url: string };

const MAX_SOURCES = 4;

// Words without accents or case: « AubeSonore », « aubesonore » and « Aube-Sonore » compare alike.
export const tokens = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const names = (doc: Document, text: string) =>
  doc.names.some(name => {
    const words = tokens(name);
    return words.length > 0 && text.includes(` ${words.join(' ')} `);
  });

// Computed in code, never by the model: a document is a source when the answer names it, then
// when the question or an earlier turn does, since a follow-up answer says « elle » for the
// project the conversation is about.
export function citedSources(
  answer: string,
  documents: Document[],
  conversation: string[] = [],
): Source[] {
  const cited = new Set<Document>();
  for (const text of [answer, ...conversation]) {
    const padded = ` ${tokens(text).join(' ')} `;
    for (const doc of documents) if (names(doc, padded)) cited.add(doc);
  }
  return [...cited].slice(0, MAX_SOURCES).map(({ title, url }) => ({ title, url }));
}
