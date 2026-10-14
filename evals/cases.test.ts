import { describe, expect, it } from 'vitest';
import { content } from '../src/lib/agent/content';
import { unlink } from '../src/lib/agent/knowledge';
import { cases, type Fact } from './cases';
import { fileAt, loadWorld } from './world';

const world = loadWorld();
const flat = (text: string) => unlink(text).replace(/\s+/g, ' ');

function sourceText(source: string): string | undefined {
  const cut = source.indexOf(':');
  const [kind, name] = cut < 0 ? [source, ''] : [source.slice(0, cut), source.slice(cut + 1)];
  const repo = world.repos.find(candidate => candidate.name === name);
  if (kind === 'persona') return content.persona;
  if (kind === 'post') return content.posts.find(post => post.slug === name)?.body;
  if (kind === 'readme') return repo?.readme ?? undefined;
  if (kind === 'description') return repo?.description ?? undefined;
  if (kind === 'file') {
    const slash = name.indexOf('/');
    return fileAt(world, name.slice(0, slash), name.slice(slash + 1));
  }
  return undefined;
}

const facts = cases.flatMap(({ question, facts = [] }) =>
  facts.map((fact): [string, Fact] => [question, fact]),
);

describe('expected facts', () => {
  it.each(facts)('%s: the passage is still in its source', (_question, fact) => {
    const text = sourceText(fact.source);
    expect(text, `source ${fact.source}`).toBeDefined();
    expect(flat(text!)).toContain(flat(fact.quote));
  });
});
