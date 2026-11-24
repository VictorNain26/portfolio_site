import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import type { Document } from './knowledge';
import { citedSources, tokens } from './sources';

const doc = (id: string, ...names: string[]): Document => ({
  id,
  title: names[0]!,
  url: `https://example.com/${id}`,
  names,
  text: '',
});

const aubesonore = doc('project:aubesonore', 'AubeSonore', 'aubesonore');
const pipeline = doc('project:radio-pipeline', 'Radio pipeline', 'radio-pipeline');
const catiche = doc('project:catiche-monorepo', 'Catiche', 'catiche-monorepo');
const documents = [aubesonore, pipeline, catiche];
const titles = (answer: string, conversation: string[] = []) =>
  citedSources(answer, documents, conversation).map(source => source.title);

describe('citedSources', () => {
  it('cites a project named in the answer, accents and case aside', () => {
    expect(titles('Sur AUBESONORE, la radio tourne seule.')).toEqual(['AubeSonore']);
  });

  it('cites a project by its repo name, hyphens written as spaces', () => {
    expect(titles('Le dépôt catiche monorepo porte le tuteur.')).toEqual(['Catiche']);
  });

  it('matches whole words only', () => {
    expect(titles('Une aubesonorement longue phrase.')).toEqual([]);
  });

  it('cites nothing when the answer names no project', () => {
    expect(titles('Victor a appris à coder au Wagon.')).toEqual([]);
  });

  // A follow-up answer often says « elle » for the project the question or the last turn named.
  it('cites a project the question or the earlier turns name, after those the answer names', () => {
    expect(
      titles('Elle passe par AzuraCast.', ['Et elle diffuse comment ?', 'Parle-moi d’AubeSonore']),
    ).toEqual(['AubeSonore']);
    expect(titles('Catiche aussi.', ['Et aubesonore ?'])).toEqual(['Catiche', 'AubeSonore']);
  });

  it('cites each project once, in corpus order', () => {
    expect(titles('Catiche, puis AubeSonore, puis aubesonore encore.')).toEqual([
      'AubeSonore',
      'Catiche',
    ]);
  });
});

// Names drawn from a small alphabet so that answers do name some of them.
const word = fc.stringMatching(/^[a-zé]{2,6}$/);
const corpus = fc
  .uniqueArray(fc.array(word, { minLength: 1, maxLength: 2 }), {
    minLength: 1,
    maxLength: 8,
    selector: name => name.join(' '),
  })
  .map(names => names.map((name, i) => doc(`project:${i}`, name.join(' '))));
const answerOf = (documents: Document[]) =>
  fc
    .array(fc.oneof(word, fc.constantFrom(...documents.map(d => d.names[0]!))), { maxLength: 12 })
    .map(parts => parts.join(' '));

const named = (docs: Document[], text: string) => {
  const words = ` ${tokens(text).join(' ')} `;
  return docs.filter(d => d.names.some(name => words.includes(` ${tokens(name).join(' ')} `)));
};

describe('citedSources properties', () => {
  const input = corpus.chain(docs =>
    fc.tuple(fc.constant(docs), answerOf(docs), fc.array(answerOf(docs), { maxLength: 3 })),
  );

  it('cites only documents of the corpus, at most four, each once', () => {
    fc.assert(
      fc.property(input, ([docs, answer, conversation]) => {
        const cited = citedSources(answer, docs, conversation);
        expect(cited.length).toBeLessThanOrEqual(4);
        expect(new Set(cited.map(s => s.url)).size).toBe(cited.length);
        for (const source of cited)
          expect(docs.some(d => d.title === source.title && d.url === source.url)).toBe(true);
      }),
    );
  });

  it('cites a document iff the answer, the question or an earlier turn names it, up to four', () => {
    fc.assert(
      fc.property(input, ([docs, answer, conversation]) => {
        const all = named(docs, [answer, ...conversation].join(' \u0000 '));
        const cited = citedSources(answer, docs, conversation).map(s => s.url);
        expect(cited.length).toBe(Math.min(4, all.length));
        for (const url of cited) expect(all.map(d => d.url)).toContain(url);
      }),
    );
  });

  it('puts the documents the answer names first', () => {
    fc.assert(
      fc.property(input, ([docs, answer, conversation]) => {
        const first = named(docs, answer)
          .slice(0, 4)
          .map(d => d.url);
        expect(
          citedSources(answer, docs, conversation)
            .map(s => s.url)
            .slice(0, first.length),
        ).toEqual(first);
      }),
    );
  });
});
