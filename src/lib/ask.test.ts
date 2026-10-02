import { describe, expect, it } from 'vitest';
import { readEvents } from './ask';

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
