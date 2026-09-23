# CLAUDE.md

Instructions pour Claude Code sur ce repository.

## Commandes

- `npm install` — dépendances (Node ≥ 22.12)
- `npm run dev` — serveur de développement
- `npm run build` — build statique dans `dist/`
- `npm run verify:build` — Vitest sur `dist/` (`tests/`) : articles, sitemap,
  canonicals, JSON-LD, contraste du code
- `npm run check` — `astro check` (types `.astro` et TS)
- `npm test` — Vitest sur `src/lib`
- `npm run format` / `npm run format:check` — Prettier

## Architecture

Site statique Astro 7 déployé sur Vercel (`vercel.json` : framework, URLs sans
`.html` ni slash final, 301 des anciennes pages `/services` et des anciens
articles vers `/blog`).

- `src/pages/` — `/`, `/projets`, `/blog`, `/blog/[slug]`, 404
- `src/layouts/Base.astro` — `<head>`, SEO, JSON-LD, header, footer
- `src/content/posts/*.mdx` — articles ; `publishedAt` dans le futur = non
  publié
- `src/data/projects.ts` — projets affichés
- `src/lib/` — seule logique du site, testée
- `tests/` — assertions sur le build, lancées après `npm run build`
- `src/styles/global.css` — tokens de la charte « Papier & encre »

## Règles

- Aucun JS client hors Umami et le script inline du thème (sombre de 20 h à 7 h,
  heure locale du visiteur, dans `Base.astro`). Les animations sont en CSS et
  respectent `prefers-reduced-motion`.
- L'accent bleu profond `--accent` passe AA sur les deux papiers (8.30:1 en
  clair, 6.64:1 en sombre) : toute nouvelle teinte reste au-dessus de 4.5:1.
- Site perso de bidouille : projets perso uniquement, pas de missions client ;
  ton personnel, pas commercial. Chaque affirmation se vérifie sur GitHub.
- `public/og.png` se régénère avec `scripts/og.mjs` (voir l'en-tête du script).
