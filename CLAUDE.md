# CLAUDE.md

## Vérifier

- `npm run check` — `astro check` (types `.astro` et TS)
- `npm test` — Vitest sur `src/` ; un seul fichier :
  `npx vitest run src/lib/url.test.ts`
- `npm run build` puis `npm run verify:build` — assertions sur le build
  (`tests/`)
- `npm run format:check` — Prettier ; `npm run format` corrige

## Règles

- Un outil standard avant du code maison : SDK officiel ou bibliothèque
  maintenue, utilisé comme sa doc le montre (AI SDK, Octokit, SDK Mistral,
  remark, colorjs.io…). Ce qui reste écrit à la main dit pourquoi aucun outil ne
  le fait.

## Pièges

- `src/data/github.json`, non versionné, est écrit par `scripts/github.ts` avant
  `dev`, `check` et `build`. Le hook `Stop` saute cette étape réseau : dans un
  worktree neuf, un premier `npm run check` crée le fichier, sinon le hook
  échoue sur ses imports.
- Le topic GitHub `portfolio` décide des projets affichés et de ce que
  l'assistant voit (`src/lib/projects.ts`) : il reste hors des projets clients.
- L'assistant ne lit pas GitHub en direct : son corpus (la fiche et le README de
  chaque projet, en texte brut) vient de `src/data/github.json`, au build. Un
  README changé l'atteint au redéploiement suivant de `sync.yml`.
- Le widget de l'assistant est une île React (`src/components/Ask.tsx`,
  `useChat`) : ses styles sont globaux, sous `.ask-row` dans `Ask.astro`, car
  Astro ne scope que son propre balisage.
- BotID ne classe les requêtes que sur un déploiement Vercel : en local et dans
  les tests, `checkBotId` répond toujours « humain ».
- `public/og.png`, le favicon, les icônes et les logos se régénèrent avec
  `scripts/brand.mjs` (voir l'en-tête du script).
