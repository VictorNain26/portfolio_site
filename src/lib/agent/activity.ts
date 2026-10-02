import { z } from 'astro/zod';

export type Activity = { repo: string; type: string; date: string; commits: string[] };
export type Fetcher = (
  url: string,
  init: { headers: Record<string, string>; signal: AbortSignal },
) => Promise<Response>;

const eventsSchema = z.array(
  z.object({ type: z.string(), repo: z.object({ name: z.string() }), created_at: z.string() }),
);
const commitsSchema = z.array(z.object({ commit: z.object({ message: z.string() }) }));

const MAX_REPOS = 3;
// GitHub gets a few seconds: a stalled API must not hold the answer past its deadline.
const TIMEOUT_MS = 5_000;

export function createActivityFetcher({
  user,
  token,
  allowlist,
  fetch: get = fetch,
  ttlMs = 10 * 60 * 1000,
  now = Date.now,
}: {
  user: string;
  token?: string | undefined;
  allowlist: string[];
  fetch?: Fetcher | undefined;
  ttlMs?: number | undefined;
  now?: (() => number) | undefined;
}): (signal: AbortSignal) => Promise<Activity[]> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const allowed = new Set(allowlist.map(name => `${user}/${name}`));
  let cache: { at: number; value: Activity[] } | undefined;

  async function load(signal: AbortSignal): Promise<Activity[]> {
    const res = await get(`https://api.github.com/users/${user}/events/public?per_page=30`, {
      headers,
      signal,
    });
    if (!res.ok) throw new Error(`GitHub events: ${res.status}`);
    const byRepo = new Map<string, Activity>();
    for (const event of eventsSchema.parse(await res.json())) {
      // Filtered before the cut to MAX_REPOS: another repo's push must not take a slot.
      if (!allowed.has(event.repo.name) || byRepo.has(event.repo.name)) continue;
      byRepo.set(event.repo.name, {
        repo: event.repo.name,
        type: event.type,
        date: event.created_at,
        commits: [],
      });
    }
    const recent = [...byRepo.values()].slice(0, MAX_REPOS);
    await Promise.allSettled(
      recent.map(async activity => {
        const commits = await get(
          `https://api.github.com/repos/${activity.repo}/commits?per_page=3`,
          { headers, signal },
        );
        if (commits.ok)
          activity.commits = commitsSchema
            .parse(await commits.json())
            .map(({ commit }) => commit.message.split('\n')[0]!);
      }),
    );
    return recent;
  }

  return async signal => {
    if (cache && now() - cache.at < ttlMs) return cache.value;
    const value = await load(AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)]));
    cache = { at: now(), value };
    return value;
  };
}
