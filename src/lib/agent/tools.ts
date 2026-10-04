import { tool } from 'ai';
import { z } from 'astro/zod';
import type { Activity, CodeHit } from './github';
import type { Repo } from './repos';

// `read` collects the repos the model read during one answer (README or code): they are cited.
export function createTools({
  repos,
  activity,
  readme,
  search,
  read,
  signal,
}: {
  repos: Repo[];
  activity: (signal: AbortSignal) => Promise<Activity[]>;
  readme: (name: string, signal: AbortSignal) => Promise<string | null>;
  search?: ((query: string, signal: AbortSignal, repo?: string) => Promise<CodeHit[]>) | undefined;
  read: string[];
  signal: AbortSignal;
}) {
  const names = repos.map(repo => repo.name);
  return {
    read_readme: tool({
      description:
        'Lit le README à jour d’un des dépôts GitHub publics de Victor (texte brut, tronqué). Pour un détail technique, l’architecture ou l’état d’un dépôt que les documents ne donnent pas.',
      inputSchema: z.object({
        repo: z.enum(names).describe('Nom exact du dépôt, tel qu’il apparaît dans les documents.'),
      }),
      execute: async ({ repo }) => {
        read.push(`repo:${repo}`);
        return (await readme(repo, signal)) ?? 'Ce dépôt n’a pas de README.';
      },
    }),
    recent_activity: tool({
      description:
        'L’activité GitHub publique récente de Victor : jusqu’à trois dépôts, avec la date du dernier événement et les derniers messages de commit. Pour « en ce moment », « récemment », « cette semaine ». Un message de commit dit ce qui a changé, pas pourquoi.',
      inputSchema: z.object({}),
      execute: async () => {
        try {
          return await activity(signal);
        } catch {
          return 'GitHub ne répond pas : l’activité récente est indisponible.';
        }
      },
    }),
    ...(search && {
      search_code: tool({
        description:
          'Cherche dans le code des dépôts GitHub publics de Victor et renvoie jusqu’à cinq fichiers avec des extraits. Pour une question sur le code lui-même : où quelque chose est fait, comment, avec quelle bibliothèque. Donne quelques mots-clés tels qu’ils apparaissent dans le code, souvent en anglais (noms de fonctions, de bibliothèques, de fichiers).',
        inputSchema: z.object({
          query: z.string().min(1).max(120).describe('Mots-clés, sans opérateur de recherche.'),
          repo: z
            .enum(names)
            .optional()
            .describe('Le dépôt où chercher, quand la question en vise un ; sinon tous.'),
        }),
        execute: async ({ query, repo }) => {
          try {
            const hits = await search(query, signal, repo);
            for (const hit of hits) read.push(`repo:${hit.repo}`);
            return hits.length ? hits : 'Aucun fichier ne correspond dans ses dépôts publics.';
          } catch {
            return 'La recherche dans le code est indisponible pour le moment.';
          }
        },
      }),
    }),
  };
}
