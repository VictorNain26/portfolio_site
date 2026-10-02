import { describe, expect, it, vi } from 'vitest';
import { createGitHub, searchTerms } from './github';
import type { Repo } from './repos';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const open = new AbortController().signal;

const apiRepo = (name: string, extra: Record<string, unknown> = {}) => ({
  name,
  description: `${name} desc`,
  html_url: `https://github.com/VictorNain26/${name}`,
  language: 'TypeScript',
  stargazers_count: 1,
  pushed_at: '2026-10-02T10:00:00Z',
  archived: false,
  fork: false,
  topics: [],
  ...extra,
});

const snapshot: Repo[] = [
  {
    name: 'musilogy',
    description: 'old desc',
    url: 'https://github.com/VictorNain26/musilogy',
    language: 'Python',
    stars: 0,
    pushedAt: '2026-09-01T00:00:00Z',
    archived: false,
    topics: [],
    readme: 'Snapshot README',
  },
];

type Init = { headers: Record<string, string>; signal: AbortSignal };
const github = (fetch: (url: string, init: Init) => Promise<Response>, token?: string) =>
  createGitHub({
    user: 'VictorNain26',
    token,
    allowlist: ['musilogy', 'AubeSonore'],
    snapshot,
    fetch: vi.fn(fetch),
  });

describe('createGitHub', () => {
  it('lists allowlisted repos only, never forks, keeping the snapshot README', async () => {
    const gh = github(async () =>
      json([apiRepo('musilogy'), apiRepo('client-site'), apiRepo('AubeSonore', { fork: true })]),
    );
    const repos = await gh.repos(open);
    expect(repos.map(repo => repo.name)).toEqual(['musilogy']);
    expect(repos[0]).toMatchObject({ description: 'musilogy desc', readme: 'Snapshot README' });
  });

  it('falls back to the build snapshot when GitHub fails', async () => {
    const gh = github(async () => json({}, 503));
    expect(await gh.repos(open)).toBe(snapshot);
    expect(await gh.readme('musilogy', open)).toBe('Snapshot README');
  });

  it('serves repos from the cache, but retries after a failure', async () => {
    let calls = 0;
    const gh = github(async () => (++calls === 1 ? json({}, 503) : json([apiRepo('musilogy')])));
    await gh.repos(open);
    await gh.repos(open);
    await gh.repos(open);
    expect(calls).toBe(2);
  });

  it('reads a live README, and never one outside the allowlist', async () => {
    const fetch = vi.fn(async (url: string) =>
      url.endsWith('/musilogy/readme') ? new Response('Live README') : json({}, 404),
    );
    const gh = createGitHub({
      user: 'VictorNain26',
      allowlist: ['musilogy'],
      snapshot,
      fetch,
    });
    expect(await gh.readme('musilogy', open)).toBe('Live README');
    expect(await gh.readme('client-site', open)).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('offers no code search without a token', () => {
    expect(github(async () => json({})).search).toBeUndefined();
  });

  it('searches the user repos and keeps allowlisted hits only', async () => {
    let query = '';
    const gh = github(async url => {
      query = decodeURIComponent(new URL(url).searchParams.get('q') ?? '');
      return json({
        items: [
          {
            path: 'src/agent.ts',
            html_url: 'https://github.com/VictorNain26/AubeSonore/blob/main/src/agent.ts',
            repository: { name: 'AubeSonore' },
            text_matches: [{ fragment: 'streamText({' }],
          },
          {
            path: 'lib/chat.ts',
            html_url: 'https://github.com/VictorNain26/client-site/blob/main/lib/chat.ts',
            repository: { name: 'client-site' },
          },
        ],
      });
    }, 't0k');
    const hits = await gh.search!('streamText repo:someone/else', open);
    expect(query).toBe('streamText user:VictorNain26');
    expect(hits).toEqual([
      {
        repo: 'AubeSonore',
        path: 'src/agent.ts',
        url: 'https://github.com/VictorNain26/AubeSonore/blob/main/src/agent.ts',
        fragments: ['streamText({'],
      },
    ]);
  });
});

describe('createGitHub search scope', () => {
  it('narrows to one allowlisted repo, and ignores any other repo name', async () => {
    const queries: string[] = [];
    const gh = github(async url => {
      queries.push(decodeURIComponent(new URL(url).searchParams.get('q') ?? ''));
      return json({ items: [] });
    }, 't0k');
    await gh.search!('vitest', open, 'musilogy');
    await gh.search!('vitest', open, 'client-site');
    expect(queries).toEqual(['vitest repo:VictorNain26/musilogy', 'vitest user:VictorNain26']);
  });
});

describe('searchTerms', () => {
  it('drops every qualifier the model could add', () => {
    expect(searchTerms('vitest org:other user:x path:src  config')).toBe('vitest config');
    expect(searchTerms('repo:a/b')).toBe('');
  });
});
