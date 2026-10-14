// The GitHub the evaluation runs against: real repos recorded at one date (evals/world.json, by
// `npm run eval:record`), so the gate moves only with the code under review. Code search runs
// git grep over each repo checked out at its recorded commit, in place of GitHub's code search.
import { z } from 'astro/zod';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchTerms, type CodeHit, type GitHub } from '../src/lib/agent/github.ts';
import { reposSchema } from '../src/lib/agent/repos.ts';

export const USER = 'VictorNain26';
const MAX_HITS = 5;
const MAX_FRAGMENTS = 3;
const MAX_FRAGMENT = 400;
// What GitHub's code search leaves out: files over 350 KiB, binaries (-I), vendored and generated
// files. https://docs.github.com/en/search-github/github-code-search/about-github-code-search
const MAX_FILE_BYTES = 350 * 1024;
const UNINDEXED = [
  ':(exclude,glob)**/node_modules/**',
  ':(exclude,glob)**/vendor/**',
  ':(exclude,glob)**/dist/**',
  ':(exclude,glob)**/package-lock.json',
  ':(exclude,glob)**/bun.lock',
  ':(exclude,glob)**/yarn.lock',
  ':(exclude,glob)**/pnpm-lock.yaml',
  ':(exclude,glob)**/uv.lock',
  ':(exclude,glob)**/poetry.lock',
];

export const worldSchema = z.object({
  recordedAt: z.iso.datetime(),
  repos: reposSchema,
  // The commit each repo's default branch pointed to: code search reads the repo at it.
  commits: z.record(z.string(), z.string().regex(/^[0-9a-f]{40}$/)),
  activity: z.array(
    z.object({
      repo: z.string(),
      type: z.string(),
      date: z.string(),
      commits: z.array(z.string()),
    }),
  ),
});
export type World = z.infer<typeof worldSchema>;

export const loadWorld = (): World =>
  worldSchema.parse(JSON.parse(readFileSync(new URL('./world.json', import.meta.url), 'utf8')));

// A recorded commit never changes: its checkout is kept from one run to the next.
export const CHECKOUTS = fileURLToPath(
  new URL('../node_modules/.cache/eval-world', import.meta.url),
);

const git = (cwd: string, args: string[]) => {
  const run = spawnSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  // git grep exits 1 when nothing matches.
  if (run.status !== 0 && !(args[0] === 'grep' && run.status === 1))
    throw new Error(`git ${args.join(' ')}: ${run.stderr.trim()}`);
  return run.stdout;
};

function checkout(dir: string, repo: string, sha: string) {
  const path = join(dir, `${repo}-${sha}`);
  if (!existsSync(join(path, '.git'))) {
    mkdirSync(path, { recursive: true });
    git(path, ['init', '--quiet']);
    git(path, ['fetch', '--quiet', '--depth', '1', `https://github.com/${USER}/${repo}`, sha]);
  }
  return path;
}

export function fileAt(world: World, repo: string, file: string, dir = CHECKOUTS) {
  const sha = world.commits[repo];
  if (!sha) return undefined;
  return git(checkout(dir, repo, sha), ['show', `${sha}:${file}`]);
}

function grep(path: string, sha: string, terms: string[], extra: string[], files: string[]) {
  const oversized = git(path, ['ls-tree', '-r', '--format=%(objectsize) %(path)', sha])
    .split('\n')
    .filter(line => Number(line.slice(0, line.indexOf(' '))) > MAX_FILE_BYTES)
    .map(line => `:(exclude,literal)${line.slice(line.indexOf(' ') + 1)}`);
  return git(path, [
    'grep',
    '-I',
    '-i',
    '-F',
    '--all-match',
    ...extra,
    ...terms.flatMap(term => ['-e', term]),
    sha,
    '--',
    ...(files.length ? files.map(file => `:(literal)${file}`) : ['.']),
    ...UNINDEXED,
    ...oversized,
  ]);
}

export function worldGitHub(
  world: World,
  dir = CHECKOUTS,
): Pick<GitHub, 'repos' | 'readme' | 'search' | 'activity'> {
  const names = new Set(world.repos.map(repo => repo.name));
  return {
    repos: async () => world.repos,
    readme: async name => world.repos.find(repo => repo.name === name)?.readme ?? null,
    activity: async () => world.activity,
    search: async (query, _signal, repo) => {
      const terms = searchTerms(query).split(' ').filter(Boolean);
      if (!terms.length) return [];
      const scope = repo && names.has(repo) ? [repo] : [...names];
      const counted = scope.flatMap(name => {
        const sha = world.commits[name]!;
        const path = checkout(dir, name, sha);
        // `<sha>:<path>:<matching lines>`, one line per file.
        return grep(path, sha, terms, ['--count'], [])
          .split('\n')
          .filter(Boolean)
          .map(line => {
            const rest = line.slice(sha.length + 1);
            const cut = rest.lastIndexOf(':');
            return {
              name,
              sha,
              path,
              file: rest.slice(0, cut),
              count: Number(rest.slice(cut + 1)),
            };
          });
      });
      return counted
        .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file))
        .slice(0, MAX_HITS)
        .map(({ name, sha, path, file }): CodeHit => {
          const fragments = grep(path, sha, terms, ['-h', '-C', '1'], [file])
            .split(/^--$/m)
            .map(hunk => hunk.trim())
            .filter(Boolean)
            .slice(0, MAX_FRAGMENTS)
            .map(hunk => hunk.slice(0, MAX_FRAGMENT));
          return {
            repo: name,
            path: file,
            url: `https://github.com/${USER}/${name}/blob/${sha}/${file}`,
            fragments,
          };
        });
    },
  };
}
