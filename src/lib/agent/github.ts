import { z } from 'astro/zod';
import type { Repo } from './repos';

// What the build wrote (src/data/github.json) is the fallback when GitHub does not answer.
const MAX_README = 6000;
const TIMEOUT_MS = 5_000;
const MAX_HITS = 5;
const MAX_ACTIVE_REPOS = 3;

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

const eventsSchema = z.array(
  z.object({ type: z.string(), repo: z.object({ name: z.string() }), created_at: z.string() }),
);
const commitsSchema = z.array(z.object({ commit: z.object({ message: z.string() }) }));

export type Fetcher = (
  url: string,
  init: { headers: Record<string, string>; signal: AbortSignal },
) => Promise<Response>;
export type CodeHit = { repo: string; path: string; url: string; fragments: string[] };
export type Activity = { repo: string; type: string; date: string; commits: string[] };

// The model writes the query: qualifiers are dropped so it cannot widen the search beyond
// the opted-in repos (results are filtered against them too).
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

// GitHub's REST API, uncached: the build script (scripts/github.ts) reads it once, the assistant
// through createGitHub.
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

    async search(
      terms: string,
      repo: string | undefined,
      allowed: Set<string>,
      signal: AbortSignal,
    ): Promise<CodeHit[]> {
      // Forks are left out of code search by default; `fork:false` is not a valid qualifier.
      const scope = repo ? `repo:${user}/${repo}` : `user:${user}`;
      const q = encodeURIComponent(`${terms} ${scope}`);
      const res = await call(
        // Other repos of the account (client work) can rank first: take the maximum page, then
        // keep the opted-in hits.
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
    },

    async activity(allowed: Set<string>, signal: AbortSignal): Promise<Activity[]> {
      const res = await call(`/users/${user}/events/public?per_page=30`, signal);
      if (!res.ok) throw new Error(`GitHub events: ${res.status}`);
      const byRepo = new Map<string, Activity>();
      for (const event of eventsSchema.parse(await res.json())) {
        const [owner, name = ''] = event.repo.name.split('/');
        // Filtered before the cut to MAX_ACTIVE_REPOS: another repo's push must not take a slot.
        if (owner !== user || !allowed.has(name) || byRepo.has(event.repo.name)) continue;
        byRepo.set(event.repo.name, {
          repo: event.repo.name,
          type: event.type,
          date: event.created_at,
          commits: [],
        });
      }
      const recent = [...byRepo.values()].slice(0, MAX_ACTIVE_REPOS);
      await Promise.allSettled(
        recent.map(async activity => {
          const commits = await call(`/repos/${activity.repo}/commits?per_page=3`, signal);
          if (commits.ok)
            activity.commits = commitsSchema
              .parse(await commits.json())
              .map(({ commit }) => commit.message.split('\n')[0]!);
        }),
      );
      return recent;
    },
  };
}

export function createGitHub({
  user,
  token,
  snapshot,
  fetch,
  ttlMs = 10 * 60 * 1000,
  now = Date.now,
}: {
  user: string;
  token?: string | undefined;
  snapshot: Repo[];
  fetch?: Fetcher | undefined;
  ttlMs?: number | undefined;
  now?: (() => number) | undefined;
}) {
  const api = githubApi({ user, token, fetch });
  const cached = {
    repos: cache<Repo[]>(ttlMs, now),
    readme: cache<string | null>(ttlMs, now),
    search: cache<CodeHit[]>(ttlMs, now),
    activity: cache<Activity[]>(ttlMs, now),
  };

  // Live list, so a newly tagged repo or a fresh push reaches the agent without a redeploy.
  const repos = (signal: AbortSignal) =>
    cached
      .repos('repos', async () =>
        (await api.repos(signal)).map(repo => ({
          ...repo,
          readme: snapshot.find(known => known.name === repo.name)?.readme ?? null,
        })),
      )
      .catch(() => snapshot);
  const optedIn = async (signal: AbortSignal) =>
    new Set((await repos(signal)).map(repo => repo.name));

  return {
    repos,
    readme: async (name: string, signal: AbortSignal) => {
      if (!(await optedIn(signal)).has(name)) return null;
      const known = snapshot.find(repo => repo.name === name)?.readme ?? null;
      return cached.readme(name, () => api.readme(name, signal)).catch(() => known);
    },
    // GitHub's code search needs a token; without one the tool is not offered at all.
    search: token
      ? async (query: string, signal: AbortSignal, repo?: string) => {
          const terms = searchTerms(query);
          if (!terms) return [];
          const allowed = await optedIn(signal);
          // Only an opted-in repo narrows the search; anything else searches them all.
          const scope = repo && allowed.has(repo) ? repo : undefined;
          return cached.search(`${scope ?? '*'} ${terms}`, () =>
            api.search(terms, scope, allowed, signal),
          );
        }
      : undefined,
    activity: async (signal: AbortSignal) => {
      const allowed = await optedIn(signal);
      return cached.activity('activity', () => api.activity(allowed, signal));
    },
  };
}

export type GitHub = ReturnType<typeof createGitHub>;
