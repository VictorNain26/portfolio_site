import { Octokit } from '@octokit/rest';
import { remark } from 'remark';
import strip from 'strip-markdown';
import type { Repo } from './agent/repos';
import { PORTFOLIO_TOPIC } from './projects.ts';

// A README goes into every prompt: cut once, here, so the site and the evaluation read the same.
const MAX_README = 6000;

// The model copies the markdown it reads (links, images, badges, code blocks): the corpus keeps
// the README's text only. https://github.com/remarkjs/strip-markdown
export async function plainReadme(markdown: string): Promise<string> {
  const text = String(await remark().use(strip).process(markdown));
  return text.trim().slice(0, MAX_README).trim();
}

// GitHub's REST API, read at build time only (scripts/github.ts writes src/data/github.json,
// evals/record-world.ts the evaluation's copy): the site and the assistant never call it.
// https://octokit.github.io/rest.js
export async function readRepos({
  user,
  token,
  fetch,
}: {
  user: string;
  token?: string | undefined;
  fetch?: typeof globalThis.fetch;
}): Promise<Repo[]> {
  const octokit = new Octokit({
    ...(token && { auth: token }),
    ...(fetch && { request: { fetch } }),
  });
  const listed = await octokit.paginate(octokit.rest.repos.listForUser, {
    username: user,
    type: 'owner',
    sort: 'pushed',
    per_page: 100,
  });
  // This endpoint lists public repos only. The profile repo, named after the user, holds the
  // profile README.
  const kept = listed.filter(
    repo => !repo.fork && (repo.topics?.includes(PORTFOLIO_TOPIC) === true || repo.name === user),
  );
  return Promise.all(
    kept.map(async repo => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      homepage: repo.homepage || null,
      language: repo.language ?? null,
      stars: repo.stargazers_count ?? 0,
      // The day is enough, and keeps the build snapshot still between two pushes of a day.
      pushedAt: (repo.pushed_at ?? '').slice(0, 10),
      archived: repo.archived ?? false,
      topics: repo.topics ?? [],
      readme: await readme(octokit, user, repo.name),
    })),
  );
}

async function readme(octokit: Octokit, owner: string, repo: string): Promise<string | null> {
  try {
    const { data } = await octokit.rest.repos.getReadme({
      owner,
      repo,
      mediaType: { format: 'raw' },
    });
    return plainReadme(String(data));
  } catch (error) {
    if ((error as { status?: number }).status === 404) return null;
    throw error;
  }
}
