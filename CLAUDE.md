# CLAUDE.md

Instructions pour Claude Code lors du travail sur ce repository.

## Commandes essentielles

### Développement

- `bun install` - Installer les dépendances
- `bun run dev` - Serveur de développement
- `bun run build` - Build production
- `bun run lint` - Lint complet : Oxlint (rapide) puis ESLint
- `bun run lint:fix` - Correction automatique Oxlint + ESLint
- `bun run lint:oxlint` - Oxlint seul (passe rapide)
- `bun run lint:eslint` - ESLint seul
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

### Configuration Lint (dual-linter)

Setup en duo recommandé en 2026 — Oxlint pour la vitesse, ESLint pour la
couverture :

- **Oxlint** (`.oxlintrc.json`) : passe rapide (Rust, catégorie `correctness`),
  exécutée en premier.
- **ESLint 10** flat config (`eslint.config.mjs`) pour ce qu'Oxlint ne couvre
  pas encore :
  - `@next/eslint-plugin-next` (core-web-vitals)
  - `eslint-plugin-react-hooks` (`exhaustive-deps`)
  - `@eslint-react/eslint-plugin` (successeur de `eslint-plugin-react`,
    type-aware, React 19) en preset `recommended-typescript`
  - règles TypeScript/qualité personnalisées
- **`eslint-plugin-oxlint`** (dernier de la chaîne) éteint côté ESLint les
  règles déjà couvertes par Oxlint (zéro double rapport).
- **Prettier** reste le formateur (avec `prettier-plugin-tailwindcss`).
