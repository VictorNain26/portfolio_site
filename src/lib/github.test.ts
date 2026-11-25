import { describe, expect, it, vi } from 'vitest';
import { plainReadme, readRepos } from './github';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

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

// Octokit takes its fetch from `request.fetch`: GitHub stays out of the tests.
const github = (repos: unknown[], readmes: Record<string, string> = {}) =>
  vi.fn<typeof globalThis.fetch>(async input => {
    const url = new URL(String(input instanceof Request ? input.url : input));
    if (url.pathname === '/users/VictorNain26/repos') return json(repos);
    const name = url.pathname.match(/^\/repos\/VictorNain26\/([^/]+)\/readme$/)?.[1];
    if (name && name in readmes) return new Response(readmes[name], { status: 200 });
    return json({ message: 'Not Found' }, 404);
  });

describe('readRepos', () => {
  it('lists the repos tagged portfolio and the profile repo, never the others or forks', async () => {
    const fetch = github([
      apiRepo('musilogy'),
      apiRepo('client-site', { topics: ['nextjs'] }),
      apiRepo('AubeSonore', { fork: true }),
      apiRepo('VictorNain26', { topics: [] }),
    ]);
    const repos = await readRepos({ user: 'VictorNain26', fetch });
    expect(repos.map(repo => repo.name)).toEqual(['musilogy', 'VictorNain26']);
    expect(repos[0]).toMatchObject({
      description: 'musilogy desc',
      homepage: null,
      pushedAt: '2026-10-02',
      readme: null,
    });
  });

  it('fails loudly when GitHub does not list the repos', async () => {
    const fetch = vi.fn<typeof globalThis.fetch>(async () => json({ message: 'down' }, 503));
    await expect(readRepos({ user: 'VictorNain26', fetch })).rejects.toThrow();
  });

  it('reads each README as plain text', async () => {
    const fetch = github([apiRepo('musilogy')], { musilogy: '# Musilogy\n\nSee [the docs](x).' });
    const [repo] = await readRepos({ user: 'VictorNain26', fetch });
    expect(repo!.readme).toBe('Musilogy\n\nSee the docs.');
  });

  it('sends the token only when given', async () => {
    const fetch = github([]);
    await readRepos({ user: 'VictorNain26', token: 't0k', fetch });
    await readRepos({ user: 'VictorNain26', fetch });
    const auth = (call: number) =>
      new Headers(fetch.mock.calls[call]![1]?.headers).get('authorization');
    expect(auth(0)).toBe('token t0k');
    expect(auth(1)).toBeNull();
  });
});

describe('plainReadme', () => {
  it('keeps the text and drops links, images, emphasis, code blocks and raw HTML', async () => {
    const text = await plainReadme(
      '# Title\n\n![badge](https://img.example/b.svg) **Bold** and a [link](https://a.example).\n\n```ts\nconst x = 1;\n```\n\n<p align="center">html</p>',
    );
    expect(text).toBe('Title\n\nbadge Bold and a link.');
  });

  it('cuts a long README to its maximum', async () => {
    expect(await plainReadme('x'.repeat(10_000))).toHaveLength(6000);
  });
});
