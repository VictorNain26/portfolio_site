# CLAUDE.md

## Vérifier

- `npm run check` — `astro check` (types `.astro` et TS)
- `npm test` — Vitest sur `src/` ; un seul fichier :
  `npx vitest run src/lib/url.test.ts`
- `npm run build` puis `npm run verify:build` — assertions sur le build
  (`tests/`)
- `npm run format:check` — Prettier ; `npm run format` corrige

## Pièges

- `src/data/github.json`, non versionné, est écrit par `scripts/github.ts` avant
  `dev`, `check` et `build`. Le hook `Stop` saute cette étape réseau : dans un
  worktree neuf, un premier `npm run check` crée le fichier, sinon le hook
  échoue sur ses imports.
- Le topic GitHub `portfolio` décide des projets affichés et de ce que
  l'assistant voit (`src/lib/projects.ts`) : il reste hors des projets clients.
- `public/og.png`, le favicon, les icônes et les logos se régénèrent avec
  `scripts/brand.mjs` (voir l'en-tête du script).
