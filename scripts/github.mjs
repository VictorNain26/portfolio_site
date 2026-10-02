// Writes src/data/github.json: public repos and their READMEs, read by the agent.
// Fails loudly rather than shipping an agent that knows nothing about GitHub.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const user = 'VictorNain26';
const out = new URL('../src/data/github.json', import.meta.url);

// Personal repos only: client work must never reach the agent (CLAUDE.md). The live agent
// reads the same list (src/lib/agent/github.ts).
const ALLOWLIST = JSON.parse(
  readFileSync(new URL('../src/data/github-allowlist.json', import.meta.url), 'utf8'),
);

if (process.argv.includes('--if-missing') && existsSync(out)) process.exit(0);

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
};

const get = (path, accept) =>
  fetch(`https://api.github.com${path}`, {
    headers: accept ? { ...headers, Accept: accept } : headers,
  });

const res = await get(`/users/${user}/repos?per_page=100&type=owner&sort=pushed`);
if (!res.ok) throw new Error(`GitHub repos: ${res.status} ${await res.text()}`);

const repos = await Promise.all(
  (await res.json())
    .filter(repo => !repo.fork && ALLOWLIST.includes(repo.name))
    .map(async repo => {
      const readme = await get(
        `/repos/${user}/${repo.name}/readme`,
        'application/vnd.github.raw+json',
      );
      if (!readme.ok && readme.status !== 404)
        throw new Error(`GitHub README ${repo.name}: ${readme.status}`);
      return {
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage || null,
        language: repo.language,
        stars: repo.stargazers_count,
        pushedAt: repo.pushed_at,
        archived: repo.archived,
        topics: repo.topics ?? [],
        // Long READMEs would crowd the context window for little gain.
        readme: readme.ok ? (await readme.text()).slice(0, 6000) : null,
      };
    }),
);

writeFileSync(out, `${JSON.stringify(repos, null, 2)}\n`);
console.log(`github.json: ${repos.length} repos`);
