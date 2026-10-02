import { tool } from 'ai';
import { z } from 'astro/zod';
import type { Activity } from './activity';
import type { Repo } from './repos';

// `read` collects the repos whose README the model read during one answer: they are cited.
export function createTools({
  repos,
  activity,
  read,
}: {
  repos: Repo[];
  activity: () => Promise<Activity[]>;
  read: string[];
}) {
  const names = repos.map(repo => repo.name);
  return {
    read_readme: tool({
      description:
        'Lit le README d’un de mes dépôts GitHub publics (texte brut, tronqué). Pour un détail technique, l’architecture ou l’état d’un dépôt que les documents ne donnent pas.',
      inputSchema: z.object({
        repo: z.enum(names).describe('Nom exact du dépôt, tel qu’il apparaît dans les documents.'),
      }),
      execute: async ({ repo: name }) => {
        const repo = repos.find(item => item.name === name)!;
        read.push(`repo:${repo.name}`);
        return repo.readme ?? 'Ce dépôt n’a pas de README.';
      },
    }),
    recent_activity: tool({
      description:
        'Mon activité GitHub publique récente : jusqu’à trois dépôts, avec la date du dernier événement et les derniers messages de commit. Pour « en ce moment », « récemment », « cette semaine ». Un message de commit dit ce qui a changé, pas pourquoi.',
      inputSchema: z.object({}),
      execute: async () => {
        try {
          const known = new Set(names);
          return (await activity()).filter(({ repo }) => known.has(repo.split('/')[1] ?? ''));
        } catch {
          return 'GitHub ne répond pas : l’activité récente est indisponible.';
        }
      },
    }),
  };
}
