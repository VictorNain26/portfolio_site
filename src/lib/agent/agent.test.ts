import type { LanguageModelV4StreamPart } from '@ai-sdk/provider';
import { convertArrayToReadableStream, MockLanguageModelV4 } from 'ai/test';
import { describe, expect, it } from 'vitest';
import { createAgent } from './agent';
import type { Knowledge } from './knowledge';
import type { Repo } from './repos';

const usage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 5, text: 5, reasoning: 0 },
};
const finish = (unified: 'stop' | 'tool-calls'): LanguageModelV4StreamPart => ({
  type: 'finish',
  usage,
  finishReason: { unified, raw: unified },
});
const says = (...chunks: string[]) => ({
  stream: convertArrayToReadableStream<LanguageModelV4StreamPart>([
    { type: 'text-start', id: 't' },
    ...chunks.map(delta => ({ type: 'text-delta' as const, id: 't', delta })),
    { type: 'text-end', id: 't' },
    finish('stop'),
  ]),
});
const reads = (repo: string) => ({
  stream: convertArrayToReadableStream<LanguageModelV4StreamPart>([
    {
      type: 'tool-call',
      toolCallId: `call-${repo}`,
      toolName: 'read_readme',
      input: JSON.stringify({ repo }),
    },
    finish('tool-calls'),
  ]),
});

const aubesonore: Repo = {
  name: 'aubesonore',
  description: 'AubeSonore — Web radio diffusée 24 h/24.',
  url: 'https://github.com/VictorNain26/aubesonore',
  homepage: 'https://www.aubesonore.fr/',
  language: 'TypeScript',
  stars: 0,
  pushedAt: '2026-09-01',
  archived: false,
  topics: ['portfolio', 'typescript'],
  readme: 'Diffuse via AzuraCast, le dimanche.',
};

const knowledge: Omit<Knowledge, 'projects'> = {
  persona: 'Victor, développeur.',
  posts: [],
  repos: [
    aubesonore,
    {
      name: 'radio-pipeline',
      description: 'Feeds the radio.',
      url: 'https://github.com/VictorNain26/radio-pipeline',
      homepage: null,
      language: 'Python',
      stars: 0,
      pushedAt: '2026-09-01',
      archived: false,
      topics: [],
      readme: 'Uses AzuraCast to broadcast.',
    },
  ],
};
// GitHub as the build snapshot: the agent's own behaviour is under test, not the live fetch.
const github = {
  repos: async () => knowledge.repos,
  readme: async (name: string) => knowledge.repos.find(repo => repo.name === name)?.readme ?? null,
  search: undefined,
  activity: async () => [],
};

const searches = (query: string) => ({
  stream: convertArrayToReadableStream<LanguageModelV4StreamPart>([
    {
      type: 'tool-call',
      toolCallId: 'call-search',
      toolName: 'search_code',
      input: JSON.stringify({ query }),
    },
    finish('tool-calls'),
  ]),
});

const run = async (
  model: MockLanguageModelV4,
  signal = new AbortController().signal,
  question = 'Ta radio ?',
) => {
  const answer = createAgent({
    model,
    knowledge,
    github,
    publishedBy: new Date('2026-10-01'),
    siteUrl: 'https://example.com',
    reasoning: 'none',
  })({
    question,
    history: [],
    signal,
    now: new Date(),
  });
  let text = '';
  for await (const chunk of answer.text) text += chunk;
  return { text, sources: answer.sources(text) };
};

describe('createAgent', () => {
  it('reads projects from the live repo list: a description edited on GitHub needs no deploy', async () => {
    const model = new MockLanguageModelV4({ doStream: says('Une radio du dimanche.') });
    const edited = { ...aubesonore, description: 'AubeSonore — Radio du dimanche matin.' };
    const answer = createAgent({
      model,
      knowledge,
      github: { ...github, repos: async () => [edited] },
      publishedBy: new Date('2026-10-01'),
      siteUrl: 'https://example.com',
      reasoning: 'none',
    })({
      question: 'Ta radio ?',
      history: [],
      signal: new AbortController().signal,
      now: new Date(),
    });
    for await (const _ of answer.text);
    const prompt = JSON.stringify(model.doStreamCalls[0]?.prompt);
    expect(prompt).toContain('AubeSonore (En ligne) : Radio du dimanche matin.');
    expect(prompt).not.toContain('Web radio diffusée 24 h/24.');
  });

  it('reads the README of the project a question names before the model answers', async () => {
    const model = new MockLanguageModelV4({ doStream: says('Elle diffuse via AzuraCast.') });
    const { sources } = await run(model, undefined, 'Comment diffuse AubeSonore ?');
    const prompt = JSON.stringify(model.doStreamCalls[0]?.prompt);
    expect(prompt).toContain('README du dépôt aubesonore');
    expect(prompt).toContain('Diffuse via AzuraCast, le dimanche.');
    expect(model.doStreamCalls).toHaveLength(1);
    expect(sources.map(source => source.title)).toEqual(['aubesonore sur GitHub']);
  });

  it('reads the README of a repo named directly, and no other', async () => {
    const model = new MockLanguageModelV4({ doStream: says('Il alimente la radio.') });
    await run(model, undefined, 'Que fait radio-pipeline ?');
    const prompt = JSON.stringify(model.doStreamCalls[0]?.prompt);
    expect(prompt).toContain('README du dépôt radio-pipeline');
    expect(prompt).not.toContain('README du dépôt aubesonore');
  });

  it('reads no README when the conversation names no project or repo', async () => {
    const model = new MockLanguageModelV4({ doStream: says('Victor a appris au Wagon.') });
    await run(model, undefined, 'Tu as appris à coder où ?');
    const prompt = JSON.stringify(model.doStreamCalls[0]?.prompt);
    expect(prompt).not.toContain('README du dépôt aubesonore');
    expect(prompt).not.toContain('README du dépôt radio-pipeline');
  });

  it('streams the answer and cites the project it names', async () => {
    const { text, sources } = await run(
      new MockLanguageModelV4({ doStream: says('AubeSonore ', 'diffuse.') }),
    );
    expect(text).toBe('AubeSonore diffuse.');
    expect(sources).toEqual([{ title: 'AubeSonore', url: 'https://www.aubesonore.fr/' }]);
  });

  it('drops markdown asterisks and backticks but keeps underscores in repo names', async () => {
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

  it('cites a README the model read, and sends the README back to it', async () => {
    const model = new MockLanguageModelV4({
      doStream: [reads('radio-pipeline'), says('Elle diffuse avec AzuraCast.')],
    });
    const { sources } = await run(model);
    expect(sources.map(source => source.title)).toEqual(['radio-pipeline sur GitHub']);
    expect(JSON.stringify(model.doStreamCalls[1]!.prompt)).toContain(
      'Uses AzuraCast to broadcast.',
    );
  });

  it('cites the repo of a file found by the code search', async () => {
    const model = new MockLanguageModelV4({
      doStream: [searches('streamText'), says('Le flux est dans pipeline.py.')],
    });
    const answer = createAgent({
      model,
      knowledge,
      github: {
        ...github,
        search: async () => [
          {
            repo: 'radio-pipeline',
            path: 'pipeline.py',
            url: 'https://github.com/VictorNain26/radio-pipeline/blob/main/pipeline.py',
            fragments: ['def stream():'],
          },
        ],
      },
      publishedBy: new Date('2026-10-01'),
      siteUrl: 'https://example.com',
      reasoning: 'none',
    })({ question: 'Où ?', history: [], signal: new AbortController().signal, now: new Date() });
    let text = '';
    for await (const chunk of answer.text) text += chunk;
    expect(answer.sources(text).map(source => source.title)).toEqual(['radio-pipeline sur GitHub']);
    expect(JSON.stringify(model.doStreamCalls[1]!.prompt)).toContain('def stream():');
  });

  it('forbids tools on the last step, so the model has to write', async () => {
    const model = new MockLanguageModelV4({
      doStream: [
        reads('radio-pipeline'),
        reads('radio-pipeline'),
        reads('radio-pipeline'),
        says('Fini.'),
      ],
    });
    expect((await run(model)).text).toBe('Fini.');
    expect(model.doStreamCalls[3]!.toolChoice).toEqual({ type: 'none' });
  });

  it('throws when the answer is aborted, instead of ending as if complete', async () => {
    const stop = new AbortController();
    stop.abort(new Error('deadline'));
    await expect(
      run(new MockLanguageModelV4({ doStream: says('Une réponse ', 'coupée.') }), stop.signal),
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
