// The GitHub the evaluation runs against: the opted-in repos and their READMEs as recorded at one
// date (evals/world.json, by `npm run eval:record`), so the gate moves only with the code under
// review. It has the shape of src/data/github.json, the site's own copy.
import { z } from 'astro/zod';
import { readFileSync } from 'node:fs';
import { reposSchema } from '../src/lib/agent/repos.ts';

export const USER = 'VictorNain26';

export const worldSchema = z.object({ recordedAt: z.iso.datetime(), repos: reposSchema });
export type World = z.infer<typeof worldSchema>;

export const loadWorld = (): World =>
  worldSchema.parse(JSON.parse(readFileSync(new URL('./world.json', import.meta.url), 'utf8')));
