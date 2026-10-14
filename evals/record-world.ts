// Records evals/world.json: the opted-in repos with their READMEs, the commit each one is at, and
// the public activity, as GitHub serves them now. Rerun it in its own pull request to move the
// evaluation onto newer repos, and review the cases against the data diff.
import { writeFileSync } from 'node:fs';
import { githubApi } from '../src/lib/agent/github.ts';
import { USER, worldSchema } from './world.ts';

const token = process.env['GITHUB_TOKEN'];
const github = githubApi({ user: USER, token });
const signal = new AbortController().signal;

async function heads(names: string[]) {
  return Object.fromEntries(
    await Promise.all(
      names.map(async name => {
        const res = await fetch(`https://api.github.com/repos/${USER}/${name}/commits/HEAD`, {
          headers: {
            Accept: 'application/vnd.github.sha',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (!res.ok) throw new Error(`GitHub HEAD of ${name}: ${res.status}`);
        return [name, (await res.text()).trim()] as const;
      }),
    ),
  );
}

const listed = await github.repos(signal);
const names = listed.map(repo => repo.name);
const before = await heads(names);
const repos = await Promise.all(
  listed.map(async repo => ({ ...repo, readme: await github.readme(repo.name, signal) })),
);
const activity = await github.activity(new Set(names), signal);
const after = await heads(names);
const moved = names.filter(name => before[name] !== after[name]);
// A README read after a push would not match the commit code search reads.
if (moved.length) throw new Error(`Pushed to during the recording, run it again: ${moved}`);

const world = worldSchema.parse({
  recordedAt: new Date().toISOString(),
  repos,
  commits: after,
  activity,
});
writeFileSync(new URL('./world.json', import.meta.url), `${JSON.stringify(world, null, 2)}\n`);
console.log(`world.json: ${repos.length} repos, ${activity.length} active, ${world.recordedAt}`);
