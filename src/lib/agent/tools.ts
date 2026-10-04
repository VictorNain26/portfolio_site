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
        'Lit le README à jour d’un dépôt de Victor (texte brut, tronqué). À appeler avant de répondre sur un projet ou un dépôt : ce qu’il fait, comment il marche, pourquoi, où il en est. Les documents n’en donnent qu’une ligne.',
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
        'L’activité GitHub publique récente de Victor : jusqu’à trois dépôts, avec la date du dernier événement et les derniers messages de commit. À appeler pour « en ce moment », « récemment », « cette semaine ». Un message de commit dit ce qui a changé, pas pourquoi.',
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
          'Cherche dans le code à jour des dépôts publics de Victor et renvoie jusqu’à cinq fichiers avec des extraits. À appeler avant de répondre sur une technologie, une bibliothèque, un outil ou un langage (« tu as déjà utilisé X ? », « tu codes en Y ? », « avec quoi il teste ? »), ou sur la façon dont quelque chose est fait dans son code. Donne un ou deux mots-clés tels qu’ils apparaissent dans le code, souvent en anglais : nom du paquet, de la bibliothèque, du fichier de configuration.',
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
