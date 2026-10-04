// Writes src/data/github.json: the opted-in public repos and their READMEs, read by /projets and
// the agent. Fails loudly rather than shipping a site that knows nothing about GitHub.
import { existsSync, writeFileSync } from 'node:fs';
import { githubApi } from '../src/lib/agent/github.ts';

const out = new URL('../src/data/github.json', import.meta.url);

if (process.argv.includes('--if-missing') && existsSync(out)) process.exit(0);

const github = githubApi({ user: 'VictorNain26', token: process.env['GITHUB_TOKEN'] });
const signal = new AbortController().signal;

const repos = await Promise.all(
  (await github.repos(signal)).map(async repo => ({
    ...repo,
    readme: await github.readme(repo.name, signal),
  })),
);

writeFileSync(out, `${JSON.stringify(repos, null, 2)}\n`);
console.log(`github.json: ${repos.length} repos`);
