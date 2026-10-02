import type { AskEvent } from './agent/handler';

// /api/ask streams one JSON event per line; a network chunk can end mid-line.
// getReader() rather than for await: Safari only iterates streams from version 27.
export async function* readEvents(
  body: ReadableStream<Uint8Array<ArrayBuffer>>,
): AsyncGenerator<AskEvent> {
  const reader = body.pipeThrough(new TextDecoderStream()).getReader();
  let pending = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = (pending + value).split('\n');
    pending = lines.pop()!;
    for (const line of lines) if (line.trim()) yield JSON.parse(line) as AskEvent;
  }
  if (pending.trim()) yield JSON.parse(pending) as AskEvent;
}
