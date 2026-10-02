import { z } from 'astro/zod';
import type { Fetcher } from './activity';
import type { Repo } from './repos';

// What the build wrote (src/data/github.json) is the fallback when GitHub does not answer.
export const MAX_README = 6000;
const TIMEOUT_MS = 5_000;
const MAX_HITS = 5;

const reposSchema = z.array(
  z.object({
    name: z.string(),
    description: z.string().nullable(),
    html_url: z.url(),
    language: z.string().nullable(),
    stargazers_count: z.number(),
    pushed_at: z.string(),
    archived: z.boolean(),
    fork: z.boolean(),
    topics: z.array(z.string()).optional(),
  }),
);
const searchSchema = z.object({
  items: z.array(
    z.object({
      path: z.string(),
      html_url: z.url(),
      repository: z.object({ name: z.string() }),
      text_matches: z.array(z.object({ fragment: z.string() })).optional(),
    }),
  ),
});

export type CodeHit = { repo: string; path: string; url: string; fragments: string[] };

// The model writes the query: qualifiers are dropped so it cannot widen the search beyond
// the allowlisted repos (results are filtered against it too).
export const searchTerms = (query: string) =>
  query
    .replace(/\b[a-z]+:\S*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);

function cache<T>(ttlMs: number, now: () => number) {
  const entries = new Map<string, { at: number; value: Promise<T> }>();
  return (key: string, load: () => Promise<T>) => {
    const hit = entries.get(key);
    if (hit && now() - hit.at < ttlMs) return hit.value;
    const value = load();
    entries.set(key, { at: now(), value });
    // A failed load must not be served from the cache.
    value.catch(() => entries.delete(key));
    return value;
  };
}

export function createGitHub({
  user,
  token,
  allowlist,
  snapshot,
  fetch: get = fetch,
  ttlMs = 10 * 60 * 1000,
  now = Date.now,
}: {
  user: string;
  token?: string | undefined;
  allowlist: string[];
  snapshot: Repo[];
  fetch?: Fetcher | undefined;
  ttlMs?: number | undefined;
  now?: (() => number) | undefined;
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
  const allowed = new Set(allowlist);
  const cached = { repos: cache<Repo[]>(ttlMs, now), readme: cache<string | null>(ttlMs, now) };
  const searches = cache<CodeHit[]>(ttlMs, now);

  async function loadRepos(signal: AbortSignal): Promise<Repo[]> {
    const res = await call(`/users/${user}/repos?per_page=100&type=owner&sort=pushed`, signal);
    if (!res.ok) throw new Error(`GitHub repos: ${res.status}`);
    return reposSchema
      .parse(await res.json())
      .filter(repo => !repo.fork && allowed.has(repo.name))
      .map(repo => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        pushedAt: repo.pushed_at,
        archived: repo.archived,
        topics: repo.topics ?? [],
        readme: snapshot.find(known => known.name === repo.name)?.readme ?? null,
      }));
  }

  async function loadReadme(name: string, signal: AbortSignal): Promise<string | null> {
    const res = await call(
      `/repos/${user}/${name}/readme`,
      signal,
      'application/vnd.github.raw+json',
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub README ${name}: ${res.status}`);
    return (await res.text()).slice(0, MAX_README);
  }

  async function loadSearch(
    terms: string,
    repo: string | undefined,
    signal: AbortSignal,
  ): Promise<CodeHit[]> {
    // Forks are left out of code search by default; `fork:false` is not a valid qualifier.
    const scope = repo ? `repo:${user}/${repo}` : `user:${user}`;
    const q = encodeURIComponent(`${terms} ${scope}`);
    const res = await call(
      // Other repos of the account (client work) can rank first: take the maximum page, then
      // keep the allowlisted hits.
      `/search/code?q=${q}&per_page=100`,
      signal,
      'application/vnd.github.text-match+json',
    );
    if (!res.ok) throw new Error(`GitHub code search: ${res.status}`);
    return searchSchema
      .parse(await res.json())
      .items.filter(item => allowed.has(item.repository.name))
      .slice(0, MAX_HITS)
      .map(item => ({
        repo: item.repository.name,
        path: item.path,
        url: item.html_url,
        fragments: (item.text_matches ?? []).map(match => match.fragment.slice(0, 400)),
      }));
  }

  return {
    // Live list, so a new repo or a fresh push reaches the agent without a redeploy.
    repos: (signal: AbortSignal) =>
      cached.repos('repos', () => loadRepos(signal)).catch(() => snapshot),
    readme: (name: string, signal: AbortSignal) => {
      if (!allowed.has(name)) return Promise.resolve(null);
      const known = snapshot.find(repo => repo.name === name)?.readme ?? null;
      return cached.readme(name, () => loadReadme(name, signal)).catch(() => known);
    },
    // GitHub's code search needs a token; without one the tool is not offered at all.
    search: token
      ? (query: string, signal: AbortSignal, repo?: string) => {
          const terms = searchTerms(query);
          // Only an allowlisted repo narrows the search; anything else searches them all.
          const scope = repo && allowed.has(repo) ? repo : undefined;
          return terms
            ? searches(`${scope ?? '*'} ${terms}`, () => loadSearch(terms, scope, signal))
            : Promise.resolve([]);
        }
      : undefined,
  };
}

export type GitHub = ReturnType<typeof createGitHub>;
