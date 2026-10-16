# CLAUDE.md

## Commandes

- `npm run dev` — serveur de développement
- `npm run check` — `astro check` (types `.astro` et TS)
- `npm test` — Vitest sur `src/`
- `npm run build` puis `npm run verify:build` — assertions sur le build
  (`tests/`)
- `npm run format` / `npm run format:check` — Prettier
- `npm run eval` — expérience Langfuse sur l'agent contre le vrai Mistral (clés
  dans `.env`, noms dans `.env.example`). À lancer avant un merge qui touche
  l'agent ; ses seuils sont dans `evals/agent.test.ts`. Elle lit le GitHub
  enregistré dans `evals/world.json`, pas le GitHub du jour
- `npm run eval:record` — réenregistre `evals/world.json`, dans sa propre PR :
  `evals/cases.test.ts` signale les faits attendus dont le passage a disparu

## Architecture

Site statique Astro sauf une route, `/api/ask`, rendue à la demande par
`@astrojs/vercel` et déployée sur Vercel (`vercel.json`).

- `/api/ask` est mon assistant IA (`src/lib/agent/`, fiche
  `src/content/persona.md`) : modèle, quota, conversations et traces se lisent
  dans `src/pages/api/ask.ts`.
- Les projets affichés viennent des dépôts publics qui ont le topic `portfolio`
  (`src/lib/projects.ts`) ; `scripts/github.ts` écrit `src/data/github.json`,
  non versionné, avant `dev`, `check` et `build`. `sync.yml` ne redéploie que si
  GitHub ou le prochain article programmé diffèrent de `/sync.json` en ligne.
- Un article dont `publishedAt` est dans le futur n'est pas publié.
- `evals/` : un cas attend des faits, jugés sur le sens, et chacun cite son
  passage ; un juge LLM ne passe en gate qu'avec ses verdicts connus d'avance
  (`evals/judge.test.ts`).
- Charte « texte brut » dans `src/styles/global.css` : une seule police, noir
  sur blanc, aucune couleur d'accent.

## Règles

- Le JS client est permis ; toute animation respecte `prefers-reduced-motion`.
- Toute teinte de texte reste au-dessus de 4.5:1 sur les deux fonds (AA).
- Site perso de bidouille : projets perso uniquement, pas de missions client ;
  ton personnel, pas commercial. Chaque affirmation se vérifie sur GitHub.
- Le topic `portfolio` ne se met jamais sur un projet client : l'assistant voit
  tous les dépôts qui l'ont.
- Un article raconte l'état à sa date : ses liens vers un fichier ou un dossier
  d'un dépôt pointent sur un commit (SHA complet, vérifié par `tests/`).
- L'assistant parle de moi à la troisième personne, jamais en mon nom, et ne
  donne que des faits : il n'affirme sur moi que ce que disent la fiche, les
  projets, les articles publiés ou GitHub ; un article programmé ne doit jamais
  lui parvenir. Modèle Mistral daté, jamais `-latest`. Ses sources se calculent
  dans le code, jamais par le modèle, et c'est le code qui lit le README à jour
  d'un dépôt ou d'un projet que la conversation nomme, avant que le modèle
  réponde.
- `public/og.png`, le favicon, les icônes et les logos se régénèrent avec
  `scripts/brand.mjs` (voir l'en-tête du script).
