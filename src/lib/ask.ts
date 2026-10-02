import type { Source } from './agent/sources';
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

export type Segment = { text: string; url?: string };

// Turns the first mention of each source in the answer into a link, so sources need no line
// of their own. A repo source is titled "name sur GitHub": the answer names it bare.
export function linkSources(answer: string, sources: Source[]): Segment[] {
  const lower = answer.toLowerCase();
  const hits: { start: number; end: number; url: string }[] = [];
  for (const source of sources) {
    const name = source.title.replace(/ sur GitHub$/, '').toLowerCase();
    const start = lower.indexOf(name);
    if (!name || start === -1) continue;
    const end = start + name.length;
    if (hits.some(hit => start < hit.end && end > hit.start)) continue;
    hits.push({ start, end, url: source.url });
  }
  hits.sort((a, b) => a.start - b.start);
  const segments: Segment[] = [];
  let at = 0;
  for (const hit of hits) {
    if (hit.start > at) segments.push({ text: answer.slice(at, hit.start) });
    segments.push({ text: answer.slice(hit.start, hit.end), url: hit.url });
    at = hit.end;
  }
  if (at < answer.length) segments.push({ text: answer.slice(at) });
  return segments;
}
