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

// Computed in code, never by the model: a document is a source when the answer names it.
export function citedSources(answer: string, documents: Document[]): Source[] {
  const text = ` ${tokens(answer).join(' ')} `;
  return documents
    .filter(doc =>
      doc.names.some(name => {
        const words = tokens(name);
        return words.length > 0 && text.includes(` ${words.join(' ')} `);
      }),
    )
    .slice(0, MAX_SOURCES)
    .map(({ title, url }) => ({ title, url }));
}
