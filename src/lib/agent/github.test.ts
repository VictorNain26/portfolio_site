import { describe, expect, it, vi } from 'vitest';
import { createGitHub, searchTerms } from './github';
import type { Repo } from './repos';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const open = new AbortController().signal;

const apiRepo = (name: string, extra: Record<string, unknown> = {}) => ({
  name,
  description: `${name} desc`,
  html_url: `https://github.com/VictorNain26/${name}`,
  homepage: '',
  language: 'TypeScript',
  stargazers_count: 1,
  pushed_at: '2026-10-02T10:00:00Z',
  archived: false,
  fork: false,
  topics: ['portfolio'],
  ...extra,
});

const snapshot: Repo[] = [
  {
    name: 'musilogy',
    description: 'old desc',
    url: 'https://github.com/VictorNain26/musilogy',
    homepage: null,
    language: 'Python',
    stars: 0,
    pushedAt: '2026-09-01',
    archived: false,
    topics: [],
    readme: 'Snapshot README',
  },
];

type Init = { headers: Record<string, string>; signal: AbortSignal };
const account = [
  apiRepo('musilogy'),
  apiRepo('AubeSonore'),
  apiRepo('portfolio_site'),
  apiRepo('client-site', { topics: ['nextjs'] }),
];
// Routes the repo list, and hands every other request to the test.
const withRepos =
  (fetch: (url: string, init: Init) => Promise<Response>, repos: unknown[] = account) =>
  (url: string, init: Init) =>
    url.includes('/users/VictorNain26/repos') ? Promise.resolve(json(repos)) : fetch(url, init);
const github = (fetch: (url: string, init: Init) => Promise<Response>, token?: string) =>
  createGitHub({ user: 'VictorNain26', token, snapshot, fetch: vi.fn(withRepos(fetch)) });

describe('createGitHub', () => {
  it('lists the repos tagged portfolio and the profile repo, never the others or forks', async () => {
    const gh = createGitHub({
      user: 'VictorNain26',
      snapshot,
      fetch: async () =>
        json([
          apiRepo('musilogy'),
          apiRepo('client-site', { topics: ['nextjs'] }),
          apiRepo('AubeSonore', { fork: true }),
          apiRepo('VictorNain26', { topics: [] }),
        ]),
    });
    const repos = await gh.repos(open);
    expect(repos.map(repo => repo.name)).toEqual(['musilogy', 'VictorNain26']);
    expect(repos[0]).toMatchObject({
      description: 'musilogy desc',
      homepage: null,
      pushedAt: '2026-10-02',
      readme: 'Snapshot README',
    });
  });

  it('falls back to the build snapshot when GitHub fails', async () => {
    const gh = createGitHub({ user: 'VictorNain26', snapshot, fetch: async () => json({}, 503) });
    expect(await gh.repos(open)).toBe(snapshot);
    expect(await gh.readme('musilogy', open)).toBe('Snapshot README');
  });

  it('serves repos from the cache, but retries after a failure', async () => {
    let calls = 0;
    const gh = createGitHub({
      user: 'VictorNain26',
      snapshot,
      fetch: async () => (++calls === 1 ? json({}, 503) : json([apiRepo('musilogy')])),
    });
    await gh.repos(open);
    await gh.repos(open);
    await gh.repos(open);
    expect(calls).toBe(2);
  });

  it('reads a live README, and never the README of an untagged repo', async () => {
    const readmes = vi.fn(async (url: string) =>
      url.endsWith('/musilogy/readme') ? new Response('Live README') : json({}, 404),
    );
    const gh = github(readmes);
    expect(await gh.readme('musilogy', open)).toBe('Live README');
    expect(await gh.readme('client-site', open)).toBeNull();
    expect(readmes).toHaveBeenCalledTimes(1);
  });

  it('offers no code search without a token', () => {
    expect(github(async () => json({})).search).toBeUndefined();
  });

  it('searches the user repos and keeps the hits of tagged repos only', async () => {
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
  it('narrows to one tagged repo, and ignores any other repo name', async () => {
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

const events = [
  {
    type: 'PushEvent',
    repo: { name: 'VictorNain26/musilogy' },
    created_at: '2026-09-22T10:00:00Z',
  },
  { type: 'WatchEvent', repo: { name: 'someone/else' }, created_at: '2026-09-22T09:00:00Z' },
  {
    type: 'CreateEvent',
    repo: { name: 'VictorNain26/musilogy' },
    created_at: '2026-09-21T10:00:00Z',
  },
  {
    type: 'PushEvent',
    repo: { name: 'VictorNain26/portfolio_site' },
    created_at: '2026-09-20T10:00:00Z',
  },
];

function fakeFetch() {
  return vi.fn(async (url: string, _init: Init) => {
    if (url.includes('/users/VictorNain26/repos')) return json(account);
    if (url.includes('/events/public')) return json(events);
    if (url.includes('/musilogy/commits'))
      return json([{ commit: { message: 'feat: genres\n\nbody' } }]);
    if (url.includes('/portfolio_site/commits')) return json([], 500);
    return json({}, 404);
  });
}

const active = (
  fetch: (url: string, init: Init) => Promise<Response>,
  options: { token?: string; ttlMs?: number; now?: () => number } = {},
) => createGitHub({ user: 'VictorNain26', snapshot: [], fetch, ...options });

describe('createGitHub activity', () => {
  it('keeps own repos, newest first, with commit first lines', async () => {
    const fetch = fakeFetch();
    const activity = await active(fetch).activity(open);
    expect(activity).toEqual([
      {
        repo: 'VictorNain26/musilogy',
        type: 'PushEvent',
        date: '2026-09-22T10:00:00Z',
        commits: ['feat: genres'],
      },
      {
        repo: 'VictorNain26/portfolio_site',
        type: 'PushEvent',
        date: '2026-09-20T10:00:00Z',
        commits: [],
      },
    ]);
  });

  it('sends the token when given', async () => {
    const fetch = fakeFetch();
    await active(fetch, { token: 't0k' }).activity(open);
    expect(fetch.mock.calls[0]![1].headers.Authorization).toBe('Bearer t0k');
  });

  it('serves from cache within the TTL', async () => {
    const fetch = fakeFetch();
    let clock = 0;
    const github = active(fetch, { ttlMs: 1000, now: () => clock });
    const get = () => github.activity(open);
    await get();
    const calls = fetch.mock.calls.length;
    clock = 999;
    await get();
    expect(fetch.mock.calls.length).toBe(calls);
    clock = 1000;
    await get();
    expect(fetch.mock.calls.length).toBeGreaterThan(calls);
  });

  it('throws when the events request fails', async () => {
    const fetch = vi.fn(withRepos(async () => json({}, 403)));
    await expect(active(fetch).activity(open)).rejects.toThrow('GitHub events: 403');
  });

  it('stops waiting for a stalled GitHub when the answer is aborted', async () => {
    // Like fetch: rejects at once on a signal already aborted, or when it aborts.
    const stalled = vi.fn(
      (_url: string, init: Init) =>
        new Promise<Response>((_, reject) => {
          if (init.signal.aborted) reject(init.signal.reason);
          init.signal.addEventListener('abort', () => reject(init.signal.reason));
        }),
    );
    const stop = new AbortController();
    const pending = active(stalled).activity(stop.signal);
    stop.abort(new Error('deadline'));
    await expect(pending).rejects.toThrow('deadline');
  });

  it('keeps the other repos when one commits request rejects', async () => {
    const fetch = vi.fn(
      withRepos(async (url: string) => {
        if (url.includes('/events/public')) return json(events);
        if (url.includes('/musilogy/commits'))
          return json([{ commit: { message: 'feat: genres' } }]);
        throw new TypeError('fetch failed');
      }),
    );
    const activity = await active(fetch).activity(open);
    expect(activity.map(({ repo, commits }) => [repo, commits])).toEqual([
      ['VictorNain26/musilogy', ['feat: genres']],
      ['VictorNain26/portfolio_site', []],
    ]);
  });

  it('fills its slots with tagged repos only, and never reads the others', async () => {
    const clientWork = ['client-a', 'client-b', 'client-c'].map((name, i) => ({
      type: 'PushEvent',
      repo: { name: `VictorNain26/${name}` },
      created_at: `2026-09-23T1${i}:00:00Z`,
    }));
    const fetch = vi.fn(
      withRepos(async (url: string) => {
        if (url.includes('/events/public')) return json([...clientWork, ...events]);
        if (url.includes('/musilogy/commits'))
          return json([{ commit: { message: 'feat: genres' } }]);
        return json([]);
      }),
    );
    const activity = await active(fetch).activity(open);
    expect(activity.map(({ repo }) => repo)).toEqual([
      'VictorNain26/musilogy',
      'VictorNain26/portfolio_site',
    ]);
    expect(fetch.mock.calls.some(([url]) => url.includes('client-'))).toBe(false);
  });
});
