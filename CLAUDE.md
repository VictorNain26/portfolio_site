# CLAUDE.md

Instructions pour Claude Code lors du travail sur ce repository.

## Commandes essentielles

### Développement

- `bun install` - Installer les dépendances
- `bun run dev` - Serveur de développement
- `bun run build` - Build production
- `bun run lint` - Vérification ESLint
- `bun run lint:fix` - Correction automatique ESLint
- `bun run type-check` - Vérification TypeScript
- `bun run format` - Formatage Prettier

### Tests

- `bun run test` - Lancer tous les tests
- `bun run test:watch` - Tests en mode watch
- `bun run test:coverage` - Tests avec couverture

## Architecture

### Technologies

- **Next.js 15** avec App Router
- **React 19**
- **TypeScript** strict
- **Tailwind CSS 4**
- **Framer Motion** pour les animations
- **Content Collections** pour le blog (MDX)
- **Vitest** pour les tests

### Structure du projet

```
app/
├── page.tsx        # Homepage (Hero, Services, Projects, Contact)
├── blog/           # Blog avec routes dynamiques
├── layout.tsx      # Layout racine
└── globals.css     # Styles globaux

components/
├── Hero.tsx        # Section hero avec CTA
├── Services.tsx    # Services orientés valeur client
├── Projects.tsx    # Projets GitHub
├── Contact.tsx     # Section contact
├── HeaderBar.tsx   # Navigation
└── ui/             # Composants UI (shadcn/ui)

content/posts/      # Articles de blog MDX
hooks/              # Hooks React personnalisés
lib/                # Utilitaires
```

### Sections de la page d'accueil

1. **Hero** - Présentation, proposition de valeur, CTA
2. **Services** - Ce que je peux faire pour le client (résultats, pas technos)
3. **Projects** - Projets GitHub avec topic "demo"
4. **Contact** - Appel à l'action final

### Patterns de code

- Composants client : `'use client'` en haut du fichier
- Animations : Framer Motion avec support `useReducedMotion`
- Classes CSS : `clsx` + `tailwind-merge` via `cn()`
- Imports de types : `import { type X }` ou inline

### Bonnes pratiques

- **Wording** : Orienté valeur client, pas liste de technos
- **Performance** : Animations légères, lazy loading
- **Accessibilité** : Labels ARIA, support reduced motion
- **SEO** : Metadata dans layout, sitemap dynamique

### Configuration ESLint

Le projet utilise ESLint flat config (`eslint.config.mjs`) avec :
- `next/core-web-vitals`
- `next/typescript`
- Règles personnalisées pour TypeScript et React
