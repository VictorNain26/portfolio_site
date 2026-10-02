import { describe, expect, it, vi } from 'vitest';
import { createActivityFetcher } from './activity';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

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
  return vi.fn(
    async (url: string, _init: { headers: Record<string, string>; signal: AbortSignal }) => {
      if (url.includes('/events/public')) return json(events);
      if (url.includes('/musilogy/commits'))
        return json([{ commit: { message: 'feat: genres\n\nbody' } }]);
      if (url.includes('/portfolio_site/commits')) return json([], 500);
      return json({}, 404);
    },
  );
}

const open = new AbortController().signal;
const allowlist = ['musilogy', 'portfolio_site'];

describe('createActivityFetcher', () => {
  it('keeps own repos, newest first, with commit first lines', async () => {
    const fetch = fakeFetch();
    const activity = await createActivityFetcher({ user: 'VictorNain26', allowlist, fetch })(open);
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
    await createActivityFetcher({ user: 'VictorNain26', allowlist, token: 't0k', fetch })(open);
    expect(fetch.mock.calls[0]![1].headers.Authorization).toBe('Bearer t0k');
  });

  it('serves from cache within the TTL', async () => {
    const fetch = fakeFetch();
    let clock = 0;
    const get = createActivityFetcher({
      user: 'VictorNain26',
      allowlist,
      fetch,
      ttlMs: 1000,
      now: () => clock,
    });
    await get(open);
    const calls = fetch.mock.calls.length;
    clock = 999;
    await get(open);
    expect(fetch.mock.calls.length).toBe(calls);
    clock = 1000;
    await get(open);
    expect(fetch.mock.calls.length).toBeGreaterThan(calls);
  });

  it('throws when the events request fails', async () => {
    const fetch = vi.fn(async () => json({}, 403));
    await expect(
      createActivityFetcher({ user: 'VictorNain26', allowlist, fetch })(open),
    ).rejects.toThrow('GitHub events: 403');
  });

  it('stops waiting for a stalled GitHub when the answer is aborted', async () => {
    const stalled = vi.fn(
      (_url: string, init: { headers: Record<string, string>; signal: AbortSignal }) =>
        new Promise<Response>((_, reject) =>
          init.signal.addEventListener('abort', () => reject(init.signal.reason)),
        ),
    );
    const stop = new AbortController();
    const pending = createActivityFetcher({ user: 'VictorNain26', allowlist, fetch: stalled })(
      stop.signal,
    );
    stop.abort(new Error('deadline'));
    await expect(pending).rejects.toThrow('deadline');
  });

  it('keeps the other repos when one commits request rejects', async () => {
    const fetch = vi.fn(
      async (url: string, _init: { headers: Record<string, string>; signal: AbortSignal }) => {
        if (url.includes('/events/public')) return json(events);
        if (url.includes('/musilogy/commits'))
          return json([{ commit: { message: 'feat: genres' } }]);
        throw new TypeError('fetch failed');
      },
    );
    const activity = await createActivityFetcher({ user: 'VictorNain26', allowlist, fetch })(open);
    expect(activity.map(({ repo, commits }) => [repo, commits])).toEqual([
      ['VictorNain26/musilogy', ['feat: genres']],
      ['VictorNain26/portfolio_site', []],
    ]);
  });

  it('fills its slots with allowlisted repos only, and never reads the others', async () => {
    const clientWork = ['client-a', 'client-b', 'client-c'].map((name, i) => ({
      type: 'PushEvent',
      repo: { name: `VictorNain26/${name}` },
      created_at: `2026-09-23T1${i}:00:00Z`,
    }));
    const fetch = vi.fn(
      async (url: string, _init: { headers: Record<string, string>; signal: AbortSignal }) => {
        if (url.includes('/events/public')) return json([...clientWork, ...events]);
        if (url.includes('/musilogy/commits'))
          return json([{ commit: { message: 'feat: genres' } }]);
        return json([]);
      },
    );
    const activity = await createActivityFetcher({ user: 'VictorNain26', allowlist, fetch })(open);
    expect(activity.map(({ repo }) => repo)).toEqual([
      'VictorNain26/musilogy',
      'VictorNain26/portfolio_site',
    ]);
    expect(fetch.mock.calls.some(([url]) => url.includes('client-'))).toBe(false);
  });
});
