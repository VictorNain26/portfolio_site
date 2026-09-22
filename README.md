# victorlenain.fr

Site de Victor Lenain, développeur full-stack freelance à Paris :
<https://www.victorlenain.fr>

Site statique [Astro](https://astro.build) déployé sur Vercel. Une page
d'accueil, une page projets et un blog en MDX.

## Démarrer

```bash
npm install
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
