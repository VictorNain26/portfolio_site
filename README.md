# Victor Lenain - Portfolio Développeur Freelance

> Site portfolio minimaliste et orienté conversion pour le démarchage de missions freelance.
> Démo : <https://victorlenain.fr>

## Stack technique

| Catégorie | Technologies |
|-----------|-------------|
| **Framework** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **Content** | MDX via Content Collections |
| **Qualité** | ESLint strict, Vitest, Prettier |

## Structure du site

```
Hero         → Présentation + CTA contact
Services     → Ce que je peux faire pour vous
Projets      → Portfolio GitHub (filtrés par topic "demo")
Contact      → Appel à l'action final
Blog         → Articles techniques (route /blog)
```

## Démarrage rapide

```bash
# Cloner et installer
git clone https://github.com/victornain26/portfolio_site.git
cd portfolio_site
bun install

# Développement
bun run dev

# Build production
bun run build
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `bun run dev` | Serveur de développement |
| `bun run build` | Build production |
| `bun run lint` | Vérification ESLint |
| `bun run test` | Tests Vitest |
| `bun run format` | Formatage Prettier |

## Personnalisation

### Modifier les informations de contact

Éditer `components/Hero.tsx` :
- Email, WhatsApp, liens sociaux

### Ajouter des services

Éditer `components/Services.tsx` :
- Modifier le tableau `services` avec titre, description, résultats

### Ajouter des projets

Sur GitHub, ajouter le topic `demo` aux repos à afficher.

### Ajouter un article de blog

Créer un fichier `.mdx` dans `content/posts/` avec le frontmatter :

```yaml
---
title: "Titre de l'article"
summary: "Résumé court"
coverImage: "/images/posts/cover.jpg"
publishedAt: "2025-01-01"
tags: ["tag1", "tag2"]
---
```
