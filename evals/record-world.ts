// Records evals/world.json: the opted-in repos with their READMEs, as GitHub serves them now.
// Rerun it in its own pull request to move the evaluation onto newer repos, and review the cases
// against the data diff.
import { writeFileSync } from 'node:fs';
import { readRepos } from '../src/lib/github.ts';
import { USER, worldSchema } from './world.ts';

const repos = await readRepos({ user: USER, token: process.env['GITHUB_TOKEN'] });
const world = worldSchema.parse({ recordedAt: new Date().toISOString(), repos });
writeFileSync(new URL('./world.json', import.meta.url), `${JSON.stringify(world, null, 2)}\n`);
console.log(`world.json: ${repos.length} repos, ${world.recordedAt}`);
