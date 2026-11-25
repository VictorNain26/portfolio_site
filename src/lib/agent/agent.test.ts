import type { LanguageModelV4StreamPart } from '@ai-sdk/provider';
import { convertArrayToReadableStream, MockLanguageModelV4 } from 'ai/test';
import { describe, expect, it } from 'vitest';
import { createAgent } from './agent';
import type { Document } from './knowledge';
import type { AskMessage } from './messages';

const usage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 5, text: 5, reasoning: 0 },
};
const says = (...chunks: string[]) => ({
  stream: convertArrayToReadableStream<LanguageModelV4StreamPart>([
    { type: 'text-start', id: 't' },
    ...chunks.map(delta => ({ type: 'text-delta' as const, id: 't', delta })),
    { type: 'text-end', id: 't' },
    { type: 'finish', usage, finishReason: { unified: 'stop', raw: 'stop' } },
  ]),
});

const documents: Document[] = [
  {
    id: 'project:aubesonore',
    title: 'AubeSonore',
    url: 'https://www.aubesonore.fr/',
    names: ['AubeSonore', 'aubesonore'],
    text: 'AubeSonore (En ligne) : Web radio diffusée 24 h/24. Diffuse via AzuraCast.',
  },
];
const persona = '## Qui je suis\n\n- Développeur à Paris, passé par le Wagon.';

const ask = (text: string, id: string, role: 'user' | 'assistant' = 'user'): AskMessage => ({
  id,
  role,
  parts: [{ type: 'text', text }],
});

const run = async (
  model: MockLanguageModelV4,
  {
    signal = new AbortController().signal,
    now = new Date('2026-11-24T12:00:00Z'),
    messages = [ask('Bonjour', '1'), ask('Bonjour !', '2', 'assistant'), ask('Ta radio ?', '3')],
  } = {},
) => {
  const { result, sources } = await createAgent({ model, persona, documents, reasoning: 'none' })({
    messages,
    signal,
    now,
  });
  const text = await result.text;
  return { text, sources: sources(text), call: model.doStreamCalls[0]! };
};

describe('createAgent', () => {
  it('answers in one model call, with no tools', async () => {
    const model = new MockLanguageModelV4({ doStream: says('Une radio.') });
    const { call } = await run(model);
    expect(model.doStreamCalls).toHaveLength(1);
    expect(call.tools ?? []).toEqual([]);
  });

  it('puts the documents first, the rules after them, and the date last', async () => {
    const { call } = await run(new MockLanguageModelV4({ doStream: says('Une radio.') }));
    const system = call.prompt.find(message => message.role === 'system')!.content as string;
    const at = (text: string) => system.indexOf(text);
    expect(at('passé par le Wagon')).toBeGreaterThan(-1);
    expect(at('Diffuse via AzuraCast')).toBeGreaterThan(at('passé par le Wagon'));
    expect(at('# Consignes')).toBeGreaterThan(at('Diffuse via AzuraCast'));
    expect(system.trimEnd().endsWith('Nous sommes le 24 novembre 2026.')).toBe(true);
  });

  // A README's own headings (# AubeSonore, ## Stack) must not read as the prompt's structure.
  it('wraps the persona and each document in a tag, so README headings stay inside', async () => {
    const { call } = await run(new MockLanguageModelV4({ doStream: says('Une radio.') }));
    const system = call.prompt.find(message => message.role === 'system')!.content as string;
    expect(system).toContain('<document title="Fiche de Victor">\n## Qui je suis');
    expect(system).toContain('<document title="AubeSonore">\nAubeSonore (En ligne)');
    expect(system.match(/<\/document>/g)).toHaveLength(2);
    expect(system).toMatch(/victorlenain\.fr.*portfolio_site/);
  });

  it('cites the project a follow-up is about, though its answer does not name it', async () => {
    const model = new MockLanguageModelV4({ doStream: says('Elle passe par AzuraCast.') });
    const { sources } = await run(model, {
      messages: [
        ask('C’est quoi AubeSonore ?', '1'),
        ask('Une web radio.', '2', 'assistant'),
        ask('Et elle diffuse comment ?', '3'),
      ],
    });
    expect(sources).toEqual([{ title: 'AubeSonore', url: 'https://www.aubesonore.fr/' }]);
  });

  it('keeps the cache key the same from one day to the next', async () => {
    const key = async (now: Date) =>
      (await run(new MockLanguageModelV4({ doStream: says('Oui.') }), { now })).call
        .providerOptions?.['mistral']?.['promptCacheKey'];
    const today = await key(new Date('2026-11-24'));
    expect(today).toMatch(/^[0-9a-f]{16}$/);
    expect(await key(new Date('2026-11-25'))).toBe(today);
  });

  it('sends the earlier turns before the question', async () => {
    const { call } = await run(new MockLanguageModelV4({ doStream: says('Oui.') }));
    expect(call.prompt.filter(m => m.role !== 'system').map(m => m.role)).toEqual([
      'user',
      'assistant',
      'user',
    ]);
  });

  it('streams the answer and cites the project it names', async () => {
    const { text, sources } = await run(
      new MockLanguageModelV4({ doStream: says('AubeSonore ', 'diffuse.') }),
    );
    expect(text).toBe('AubeSonore diffuse.');
    expect(sources).toEqual([{ title: 'AubeSonore', url: 'https://www.aubesonore.fr/' }]);
  });

  // Streamdown renders the answer's markdown on the page: the stream carries it untouched.
  it('passes the model’s markdown through', async () => {
    const { text } = await run(
      new MockLanguageModelV4({ doStream: says('Le dépôt **portfolio', '_site**.') }),
    );
    expect(text).toBe('Le dépôt **portfolio_site**.');
  });

  it('reports a provider failure in the stream, for the handler to turn into an error part', async () => {
    const model = new MockLanguageModelV4({
      doStream: {
        stream: convertArrayToReadableStream<LanguageModelV4StreamPart>([
          { type: 'error', error: new Error('overloaded') },
        ]),
      },
    });
    const { result } = await createAgent({ model, persona, documents, reasoning: 'none' })({
      messages: [ask('Ta radio ?', '1')],
      signal: new AbortController().signal,
      now: new Date(),
    });
    const parts = [];
    for await (const part of result.stream) parts.push(part.type);
    expect(parts).toContain('error');
  });
});
