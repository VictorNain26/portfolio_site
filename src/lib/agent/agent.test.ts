import type { LanguageModelV4StreamPart } from '@ai-sdk/provider';
import { convertArrayToReadableStream, MockLanguageModelV4 } from 'ai/test';
import { describe, expect, it } from 'vitest';
import { createAgent } from './agent';
import type { Document } from './knowledge';

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

const run = async (
  model: MockLanguageModelV4,
  { signal = new AbortController().signal, now = new Date('2026-11-24T12:00:00Z') } = {},
) => {
  const answer = createAgent({ model, persona, documents, reasoning: 'none' })({
    question: 'Ta radio ?',
    history: [{ question: 'Bonjour', answer: 'Bonjour !' }],
    signal,
    now,
  });
  let text = '';
  for await (const chunk of answer.text) text += chunk;
  return { text, sources: answer.sources(text), call: model.doStreamCalls[0]! };
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

  it('drops markdown asterisks and backticks across chunks, but keeps underscores', async () => {
    const { text } = await run(
      new MockLanguageModelV4({
        doStream: says('Le dépôt **portfolio', '_site** et *AubeSonore*, dans `tests/`.'),
      }),
    );
    expect(text).toBe('Le dépôt portfolio_site et AubeSonore, dans tests/.');
  });

  it('keeps the answer on one line when the model breaks lines', async () => {
    const { text } = await run(
      new MockLanguageModelV4({
        doStream: says('Deux usages :\n', 'D’abord la radio.\n\nEnsuite le site.'),
      }),
    );
    expect(text).toBe('Deux usages : D’abord la radio. Ensuite le site.');
  });

  it('throws when the answer is aborted, instead of ending as if complete', async () => {
    const stop = new AbortController();
    stop.abort(new Error('deadline'));
    await expect(
      run(new MockLanguageModelV4({ doStream: says('Une réponse ', 'coupée.') }), {
        signal: stop.signal,
      }),
    ).rejects.toThrow('answer aborted');
  });

  it('throws when the provider fails mid-stream', async () => {
    const model = new MockLanguageModelV4({
      doStream: {
        stream: convertArrayToReadableStream<LanguageModelV4StreamPart>([
          { type: 'error', error: new Error('overloaded') },
        ]),
      },
    });
    await expect(run(model)).rejects.toThrow('overloaded');
  });
});
