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
const titles = (answer: string) => citedSources(answer, documents).map(source => source.title);

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

describe('citedSources properties', () => {
  it('cites only documents of the corpus, at most four', () => {
    fc.assert(
      fc.property(
        corpus.chain(docs => fc.tuple(fc.constant(docs), answerOf(docs))),
        ([docs, answer]) => {
          const cited = citedSources(answer, docs);
          expect(cited.length).toBeLessThanOrEqual(4);
          for (const source of cited)
            expect(docs.some(d => d.title === source.title && d.url === source.url)).toBe(true);
        },
      ),
    );
  });

  it('cites a document if and only if the answer names it, up to four', () => {
    fc.assert(
      fc.property(
        corpus.chain(docs => fc.tuple(fc.constant(docs), answerOf(docs))),
        ([docs, answer]) => {
          const text = ` ${tokens(answer).join(' ')} `;
          const named = docs.filter(d =>
            d.names.some(name => text.includes(` ${tokens(name).join(' ')} `)),
          );
          expect(citedSources(answer, docs).map(s => s.url)).toEqual(
            named.slice(0, 4).map(d => d.url),
          );
        },
      ),
    );
  });
});
