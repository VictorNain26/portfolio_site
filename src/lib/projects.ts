import { z } from 'astro/zod';
import { PORTFOLIO_TOPIC } from './agent/github';

export type Project = {
  name: string;
  tagline: string;
  stack: string[];
  url: string;
  repo: string;
  status: 'En ligne' | 'Pré-lancement' | 'Sur GitHub' | 'Archivé';
  updatedAt: Date;
};

const PRE_LAUNCH = 'pre-launch';
const SEPARATOR = ' — ';

const repoSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  url: z.url(),
  homepage: z.url().nullable(),
  topics: z.array(z.string()),
  archived: z.boolean(),
  pushedAt: z.iso.date(),
});

const status = (repo: z.infer<typeof repoSchema>): Project['status'] => {
  if (repo.archived) return 'Archivé';
  if (repo.topics.includes(PRE_LAUNCH)) return 'Pré-lancement';
  return repo.homepage ? 'En ligne' : 'Sur GitHub';
};

// A repo is shown once it carries the `portfolio` topic, with nothing else to fill in: a
// description that reads « Nom — accroche » names it, otherwise the repo name does. Its other
// topics are the stack. Archived ones come last.
export function projectsFrom(github: unknown): Project[] {
  return z
    .array(repoSchema)
    .parse(github)
    .filter(repo => repo.topics.includes(PORTFOLIO_TOPIC))
    .map(repo => {
      const description = repo.description?.trim() ?? '';
      const at = description.indexOf(SEPARATOR);
      return {
        name: at > 0 ? description.slice(0, at) : repo.name,
        tagline: at > 0 ? description.slice(at + SEPARATOR.length) : description,
        stack: repo.topics.filter(topic => topic !== PORTFOLIO_TOPIC && topic !== PRE_LAUNCH),
        url: repo.homepage ?? repo.url,
        repo: repo.url,
        status: status(repo),
        updatedAt: new Date(repo.pushedAt),
      };
    })
    .sort((a, b) => Number(a.status === 'Archivé') - Number(b.status === 'Archivé'));
}
