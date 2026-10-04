# CLAUDE.md

## Commandes

- `npm install` — dépendances (Node ≥ 22.12)
- `npm run dev` — serveur de développement
- `npm run build` — build dans `dist/client/` et `.vercel/output/`
- `npm run verify:build` — Vitest sur `dist/client/` et `.vercel/output/`
  (`tests/`) : articles, sitemap, canonicals, JSON-LD, llms.txt, contraste du
  code, config de la fonction
- `npm run check` — `astro check` (types `.astro` et TS)
- `npm test` — Vitest sur `src/`
- `npm run format` / `npm run format:check` — Prettier
- `npm run eval` — expérience Langfuse sur l'agent contre le vrai Mistral (clés
  dans `.env`, noms dans `.env.example`) : `EVAL_RUNS`, `EVAL_REASONING`. À
  lancer avant un merge qui touche l'agent ; ses seuils sont dans
  `evals/agent.test.ts`

## Architecture

Site statique Astro 7 sauf une route : `/api/ask`, rendue à la demande par
`@astrojs/vercel` (les pages statiques sortent dans `dist/client/`). Déployé sur
Vercel (`vercel.json` : framework, URLs sans `.html` ni slash final, 301 des
anciennes pages `/services` et des anciens articles vers `/blog`).

- `src/pages/` — `/`, `/projets`, `/blog`, `/blog/[slug]`, 404
- `src/pages/llms.txt.ts`, `src/pages/blog/[slug].md.ts` — `/llms.txt` et la
  version Markdown de chaque article, générés (`src/lib/llms.ts`) depuis la
  section « Qui je suis » de la fiche, les projets et les articles publiés
- `src/layouts/Base.astro` — `<head>`, SEO, JSON-LD, header, footer
- `src/content/posts/*.mdx` — articles ; `publishedAt` dans le futur = non
  publié
- `src/data/projects.ts` — projets affichés, lus dans `github.json`
  (`src/lib/projects.ts`) : les dépôts publics qui ont le topic `portfolio`,
  sans rien d'autre à remplir. Une description « Nom — accroche » donne le nom,
  sinon c'est le nom du dépôt ; les autres topics font la stack ; archivé,
  `pre-launch` ou une homepage donnent le statut. `sync.yml` (planifié toutes
  les 15 min, que GitHub retarde souvent de quelques heures) compare GitHub et
  la date du prochain article programmé à `/sync.json` du site en ligne, et ne
  redéploie que s'ils diffèrent
- `src/pages/api/ask.ts` — mon assistant IA, qui répond sur moi et mon code : AI
  SDK, Mistral Small 4 (`mistral-small-2603`, raisonnement coupé, sans limite de
  tokens de sortie), quota et conversations dans Upstash Redis, traces Langfuse
  quand ses clés existent (secrets via `astro:env`)
- `src/lib/agent/` — l'agent, testé : prompt, outils, sources calculées, handler
  HTTP ; `src/content/persona.md` — sa fiche
- `scripts/github.ts` — écrit `src/data/github.json` (non versionné) avant
  `dev`, `check` et `build` ; l'assistant relit dépôts et README en direct
  (`src/lib/agent/github.ts`, cache 10 min) et cherche dans le code si
  `GITHUB_TOKEN` existe. Il ne voit que les dépôts qui ont le topic `portfolio`,
  plus le dépôt profil : le topic ne se met jamais sur un projet client
- `evals/` — cas, juge et expérience de l'agent (`npm run eval`)
- `src/lib/` — seule logique du site, testée
- `tests/` — assertions sur le build, lancées après `npm run build`
- `src/styles/global.css` — tokens de la charte « texte brut » : Newsreader
  seule (Fonts API d'Astro, fournisseur Fontsource, axes `wght` et `opsz`), noir
  sur blanc, filets fins, aucune couleur d'accent

## Règles

- Le JS client est permis. En place : Umami, le `<ClientRouter />` d'Astro
  (transitions entre pages dans les deux sens, repli animé pour les navigateurs
  sans View Transitions) et le script inline du thème (sombre quand le système
  du visiteur l'est, et pour tous de 20 h à 7 h, heure locale, dans
  `Base.astro`, réappliqué à `astro:after-swap`). L'ancienne page sort d'abord
  (`page-out`, dans `Base.astro`), puis les blocs `.enter` de la nouvelle
  entrent dans l'ordre de lecture (`global.css`) : les deux pages ne se
  chevauchent jamais. Toute animation respecte `prefers-reduced-motion`.
- Une seule police, pas de teinte d'accent. `--muted` passe AA sur les deux
  fonds (6.69:1 en clair, 7.70:1 en sombre) : toute nouvelle teinte reste
  au-dessus de 4.5:1.
- Site perso de bidouille : projets perso uniquement, pas de missions client ;
  ton personnel, pas commercial. Chaque affirmation se vérifie sur GitHub.
- Un article raconte l'état à sa date : ses liens vers un fichier ou un dossier
  d'un dépôt pointent sur un commit (SHA complet, vérifié par `tests/`), et
  `links.yml` vérifie chaque semaine que ses liens répondent encore.
- L'assistant parle de moi à la troisième personne, jamais en mon nom, et ne
  donne que des faits : il n'affirme sur moi que ce que disent la fiche, les
  projets, les articles publiés ou GitHub ; un article programmé ne doit jamais
  lui parvenir. Modèle Mistral daté, jamais `-latest`. Ses sources se calculent
  dans le code, jamais par le modèle, et c'est le code qui l'oblige à lire
  GitHub avant de répondre quand une question nomme un dépôt ou un projet.
- `public/og.png`, le favicon, les icônes et les logos se régénèrent avec
  `scripts/brand.mjs` (voir l'en-tête du script).
