---
paths:
  - 'content/posts/**/*.mdx'
---

# Articles de blog

Chaque article est un `.mdx` dans `content/posts/`, indexé par Content
Collections (`content-collections.ts`). Le **slug de l'URL est le nom du
fichier** privé de son extension : `content/posts/2026-03-05-mon-titre.mdx` →
`/blog/2026-03-05-mon-titre`. Renommer un fichier casse l'URL publique et le
sitemap ; ne pas le faire pour un article déjà publié.

Frontmatter validé par Zod — un champ manquant ou mal typé fait **échouer le
build**, pas seulement le rendu :

```yaml
---
title: "Titre de l'article" # string, requis
summary: 'Résumé court' # string, requis — sert de meta description
publishedAt: '2026-03-05' # string, requis
tags: ['nextjs', 'ia'] # string[], défaut []
---
```

Aucun autre champ n'est déclaré dans le schéma : ajouter `coverImage` ou
`author` dans le frontmatter sans étendre `content-collections.ts` ne fait rien.

Ton : français, première personne, orienté retour d'expérience concret. Le
lectorat visé est dirigeant / CTO, pas développeur junior.
