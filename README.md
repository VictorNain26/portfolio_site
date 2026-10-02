# victorlenain.fr

Site de Victor Lenain, développeur à Paris : <https://www.victorlenain.fr>

Site [Astro](https://astro.build) déployé sur Vercel : une page d'accueil, une
page projets, un blog en MDX, tous statiques, et une seule route rendue à la
demande, `/api/ask`, l'assistant IA qui répond sur Victor et son code.

## Démarrer

```bash
npm install
cp .env.example .env  # clés de l'assistant, voir les commentaires du fichier
npm run dev
```

## Publier un article

Ajouter `src/content/posts/<AAAA-MM-JJ>-<slug>.mdx` avec `title`, `summary`,
`publishedAt` et `tags` en frontmatter, puis merger sur `master`. Un article
daté dans le futur n'est publié qu'au premier déploiement suivant sa date.

## Valider

La CI (`.github/workflows/ci.yml`) lance ces étapes sur chaque PR et sur
`master` :

```bash
npm run format:check && npm run check && npm test && npm run build && npm run verify:build
```

Une PR qui touche l'assistant lance aussi son évaluation contre Mistral
(`.github/workflows/eval.yml`, `npm run eval` en local).
