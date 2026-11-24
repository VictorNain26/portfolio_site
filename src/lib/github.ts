import { z } from 'astro/zod';
import type { Repo } from './agent/repos';

const MAX_README = 6000;
const TIMEOUT_MS = 5_000;

// A public repo reaches the site and the assistant only once it carries this topic, which only
// its owner can set: client work never gets it.
export const PORTFOLIO_TOPIC = 'portfolio';

const reposSchema = z.array(
  z.object({
    name: z.string(),
    description: z.string().nullable(),
    html_url: z.url(),
    homepage: z.string().nullable(),
    language: z.string().nullable(),
    stargazers_count: z.number(),
    pushed_at: z.string(),
    archived: z.boolean(),
    fork: z.boolean(),
    topics: z.array(z.string()).optional(),
  }),
);

export type Fetcher = (
  url: string,
  init: { headers: Record<string, string>; signal: AbortSignal },
) => Promise<Response>;

// GitHub's REST API, read at build time only (scripts/github.ts writes src/data/github.json,
// and evals/record-world.ts the evaluation's copy): the site and the assistant never call it.
export function githubApi({
  user,
  token,
  fetch: get = fetch,
}: {
  user: string;
  token?: string | undefined;
  fetch?: Fetcher | undefined;
}) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const call = (path: string, signal: AbortSignal, accept?: string) =>
    get(`https://api.github.com${path}`, {
      headers: accept ? { ...headers, Accept: accept } : headers,
      signal: AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)]),
    });

  return {
    // This endpoint lists public repos only. The profile repo, named after the user, holds the
    // profile README.
    async repos(signal: AbortSignal): Promise<Omit<Repo, 'readme'>[]> {
      const res = await call(`/users/${user}/repos?per_page=100&type=owner&sort=pushed`, signal);
      if (!res.ok) throw new Error(`GitHub repos: ${res.status}`);
      return reposSchema
        .parse(await res.json())
        .filter(
          repo =>
            !repo.fork && (repo.topics?.includes(PORTFOLIO_TOPIC) === true || repo.name === user),
        )
        .map(repo => ({
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          homepage: repo.homepage || null,
          language: repo.language,
          stars: repo.stargazers_count,
          // The day is enough, and keeps the build snapshot still between two pushes of a day.
          pushedAt: repo.pushed_at.slice(0, 10),
          archived: repo.archived,
          topics: repo.topics ?? [],
        }));
    },

    async readme(name: string, signal: AbortSignal): Promise<string | null> {
      const res = await call(
        `/repos/${user}/${name}/readme`,
        signal,
        'application/vnd.github.raw+json',
      );
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`GitHub README ${name}: ${res.status}`);
      return (await res.text()).slice(0, MAX_README);
    },
  };
}
