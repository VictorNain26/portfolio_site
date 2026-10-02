import { z } from 'astro/zod';

const repoSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  url: z.url(),
  language: z.string().nullable(),
  stars: z.number(),
  pushedAt: z.string(),
  archived: z.boolean(),
  topics: z.array(z.string()),
  readme: z.string().nullable(),
});

export const reposSchema = z.array(repoSchema);

export type Repo = z.infer<typeof repoSchema>;
