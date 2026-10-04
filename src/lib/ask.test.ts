import { describe, expect, it } from 'vitest';
import { linkSources, locked, readEvents } from './ask';

const stream = (...chunks: string[]) => {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array<ArrayBuffer>>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
};

const collect = async (body: ReadableStream<Uint8Array<ArrayBuffer>>) => {
  const events = [];
  for await (const event of readEvents(body)) events.push(event);
  return events;
};

describe('readEvents', () => {
  it('rebuilds events split across chunks', async () => {
    const events = await collect(
      stream('{"type":"text","te', 'xt":"Salut"}\n{"type":"sources",', '"sources":[]}\n'),
    );
    expect(events).toEqual([
      { type: 'text', text: 'Salut' },
      { type: 'sources', sources: [] },
    ]);
  });

  it('keeps a multi-byte character cut between two chunks', async () => {
    const bytes = new TextEncoder().encode('{"type":"text","text":"é"}\n');
    const cut = bytes.indexOf(0xc3) + 1;
    const body = new ReadableStream<Uint8Array<ArrayBuffer>>({
      start(controller) {
        controller.enqueue(bytes.slice(0, cut));
        controller.enqueue(bytes.slice(cut));
        controller.close();
      },
    });
    expect(await collect(body)).toEqual([{ type: 'text', text: 'é' }]);
  });

  it('reads a last event without a trailing newline', async () => {
    expect(await collect(stream('{"type":"error","code":"failed"}'))).toEqual([
      { type: 'error', code: 'failed' },
    ]);
  });
});

describe('linkSources', () => {
  const aube = { title: 'AubeSonore', url: 'https://www.aubesonore.fr/' };
  const repo = { title: 'radio-pipeline sur GitHub', url: 'https://github.com/x/radio-pipeline' };
  const post = { title: 'Salut, moi c’est Victor', url: 'https://example.com/blog/qui' };

  it('links the first mention of a source, whatever its case', () => {
    expect(linkSources('Sur aubesonore, puis AubeSonore.', [aube])).toEqual([
      { text: 'Sur ' },
      { text: 'aubesonore', url: aube.url },
      { text: ', puis AubeSonore.' },
    ]);
  });

  it('names a repo without its "sur GitHub" suffix', () => {
    expect(linkSources('Le dépôt radio-pipeline tourne.', [repo])).toEqual([
      { text: 'Le dépôt ' },
      { text: 'radio-pipeline', url: repo.url },
      { text: ' tourne.' },
    ]);
  });

  it('keeps the answer whole when no source is named in it', () => {
    expect(linkSources('Une web radio.', [post])).toEqual([{ text: 'Une web radio.' }]);
  });

  it('orders links by position and never overlaps them', () => {
    const segments = linkSources('radio-pipeline alimente AubeSonore.', [aube, repo]);
    expect(segments.map(s => s.text).join('')).toBe('radio-pipeline alimente AubeSonore.');
    expect(segments.filter(s => s.url).map(s => s.text)).toEqual(['radio-pipeline', 'AubeSonore']);
  });
});

describe('locked', () => {
  const reset = Date.parse('2026-10-05T00:00:00Z');

  it('locks until the quota window closes, then unlocks', () => {
    expect(locked(reset, reset - 1)).toBe(true);
    expect(locked(reset, reset)).toBe(false);
  });

  it('never locks without a known window', () => {
    expect(locked(undefined, reset)).toBe(false);
  });
});
