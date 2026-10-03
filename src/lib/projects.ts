import { z } from 'astro/zod';

export type Project = {
  name: string;
  tagline: string;
  stack: string[];
  url: string;
  status: 'En ligne' | 'Pré-lancement' | 'Open source';
};

const SHOWN = 'portfolio';
const PRE_LAUNCH = 'pre-launch';
const SEPARATOR = ' — ';

const repoSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  url: z.url(),
  homepage: z.url().nullable(),
  topics: z.array(z.string()),
});

// A repo is shown when it carries the `portfolio` topic; its GitHub description reads
// « Nom — accroche » and its other topics are the stack.
export function projectsFrom(github: unknown): Project[] {
  return z
    .array(repoSchema)
    .parse(github)
    .filter(repo => repo.topics.includes(SHOWN))
    .map(repo => {
      const at = repo.description?.indexOf(SEPARATOR) ?? -1;
      if (!repo.description || at < 1)
        throw new Error(`${repo.name}: the GitHub description must read « Nom — accroche »`);
      return {
        name: repo.description.slice(0, at),
        tagline: repo.description.slice(at + SEPARATOR.length),
        stack: repo.topics.filter(topic => topic !== SHOWN && topic !== PRE_LAUNCH),
        url: repo.homepage ?? repo.url,
        status: repo.topics.includes(PRE_LAUNCH)
          ? 'Pré-lancement'
          : repo.homepage
            ? 'En ligne'
            : 'Open source',
      };
    });
}
