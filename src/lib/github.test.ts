import { describe, expect, it, vi } from 'vitest';
import { githubApi, type Fetcher } from './github';

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

describe('githubApi', () => {
  it('lists the repos tagged portfolio and the profile repo, never the others or forks', async () => {
    const github = githubApi({
      user: 'VictorNain26',
      fetch: async () =>
        json([
          apiRepo('musilogy'),
          apiRepo('client-site', { topics: ['nextjs'] }),
          apiRepo('AubeSonore', { fork: true }),
          apiRepo('VictorNain26', { topics: [] }),
        ]),
    });
    const repos = await github.repos(open);
    expect(repos.map(repo => repo.name)).toEqual(['musilogy', 'VictorNain26']);
    expect(repos[0]).toMatchObject({
      description: 'musilogy desc',
      homepage: null,
      pushedAt: '2026-10-02',
    });
  });

  it('fails loudly when GitHub does not list the repos', async () => {
    const github = githubApi({ user: 'VictorNain26', fetch: async () => json({}, 503) });
    await expect(github.repos(open)).rejects.toThrow('GitHub repos: 503');
  });

  it('reads a raw README, cut to its maximum, and null when there is none', async () => {
    const fetch = vi.fn<Fetcher>(async url =>
      url.endsWith('/musilogy/readme') ? new Response('x'.repeat(10_000)) : json({}, 404),
    );
    const github = githubApi({ user: 'VictorNain26', fetch });
    expect(await github.readme('musilogy', open)).toHaveLength(6000);
    expect(await github.readme('nothing', open)).toBeNull();
    expect(fetch.mock.calls[0]![1].headers['Accept']).toBe('application/vnd.github.raw+json');
  });

  it('sends the token only when given', async () => {
    const fetch = vi.fn<Fetcher>(async () => json([]));
    await githubApi({ user: 'VictorNain26', token: 't0k', fetch }).repos(open);
    await githubApi({ user: 'VictorNain26', fetch }).repos(open);
    expect(fetch.mock.calls[0]![1].headers['Authorization']).toBe('Bearer t0k');
    expect(fetch.mock.calls[1]![1].headers['Authorization']).toBeUndefined();
  });
});
