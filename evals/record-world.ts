// Records evals/world.json: the opted-in repos with their READMEs, as GitHub serves them now.
// Rerun it in its own pull request to move the evaluation onto newer repos, and review the cases
// against the data diff.
import { writeFileSync } from 'node:fs';
import { githubApi } from '../src/lib/github.ts';
import { USER, worldSchema } from './world.ts';

const github = githubApi({ user: USER, token: process.env['GITHUB_TOKEN'] });
const signal = new AbortController().signal;

const repos = await Promise.all(
  (await github.repos(signal)).map(async repo => ({
    ...repo,
    readme: await github.readme(repo.name, signal),
  })),
);
const world = worldSchema.parse({ recordedAt: new Date().toISOString(), repos });
writeFileSync(new URL('./world.json', import.meta.url), `${JSON.stringify(world, null, 2)}\n`);
console.log(`world.json: ${repos.length} repos, ${world.recordedAt}`);
