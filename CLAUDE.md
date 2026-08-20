# CLAUDE.md

Portfolio freelance de Victor Lenain — Next.js 16 (App Router), React 19,
TypeScript, Tailwind v4. En production sur <https://victorlenain.fr>.

## Commandes

Le gestionnaire de paquets est **bun** (`packageManager: bun@1.2.14`) — jamais
npm, pnpm ou yarn.

| Commande               | Rôle                            |
| ---------------------- | ------------------------------- |
| `bun install`          | Dépendances                     |
| `bun run dev`          | Serveur de développement        |
| `bun run build`        | Build production (Turbopack)    |
| `bun run type-check`   | `tsc --noEmit`                  |
| `bun run lint`         | Oxlint puis ESLint              |
| `bun run lint:fix`     | Correction automatique des deux |
| `bun run test`         | Vitest, run unique              |
| `bun run format:check` | Prettier en vérification        |

**Porte de validation avant tout commit** — les quatre doivent passer :

```bash
bun run type-check && bun run lint && bun run test && bun run format:check
```

La branche par défaut est **`master`**, pas `main`. Les PR se font contre
`master`.

## Pièges

### La CSP est déclarée dans `next.config.js`

Tout script, iframe, police ou appel réseau vers un domaine tiers doit être
ajouté à la directive correspondante (`script-src`, `frame-src`, `connect-src`,
`font-src`) du header `Content-Security-Policy`. Sinon le navigateur le bloque
**silencieusement en production** alors que le local peut passer :
`'unsafe-eval'` n'est ajouté qu'en dev, et une directive absente retombe sur
`default-src 'self'`.

### La chaîne de lint est un duo, avec extinction croisée

Oxlint (Rust, catégorie `correctness`) passe en premier, ESLint 10 flat config
ensuite pour ce qu'Oxlint ne couvre pas : `@next/eslint-plugin-next`,
`eslint-plugin-react-hooks`, `@eslint-react/eslint-plugin` (type-aware, React
19). `eslint-plugin-oxlint` est **en dernier** dans `eslint.config.mjs` et
éteint côté ESLint les règles déjà traitées par Oxlint. Ne pas réactiver à la
main une règle qu'Oxlint couvre : ça produit un double rapport.

Baseline actuelle : 0 erreur, 11 warnings `@eslint-react` (index utilisé comme
clé, `new Date()` pendant le rendu, `set-state-in-effect`). Ne pas en ajouter.

### Les types de contenu sont générés

Content Collections écrit dans `.content-collections/` (gitignoré). Après un
clone frais ou un `clean`, lancer `bun run build` ou `bun run dev` avant de
compter sur les imports depuis `content-collections`. Un frontmatter d'article
invalide **casse le build**, pas seulement le rendu.

### Les projets affichés viennent de l'API GitHub

`lib/github.ts` ne remonte que les repos publics de `victornain26` portant le
topic `demo`. Pour ajouter un projet à la home, on ajoute le topic sur GitHub —
on ne touche pas au code.

## Conventions

- **Copy** : français, orienté résultat client, pas liste de technos. Le site
  s'adresse à des dirigeants et des CTO.
- **Server Components par défaut** : `'use client'` seulement quand il y a de
  l'état, un effet ou un écouteur (8 fichiers aujourd'hui).
- **Animations** : l'apparition au scroll passe par `useFadeOnView` +
  `.fade-on-view` (IntersectionObserver + CSS), pas par Framer Motion. Framer
  Motion ne sert plus que dans `HeaderBar` et `BackToTop`. Toute animation
  respecte `prefers-reduced-motion`, géré dans `globals.css`.
- **Classes CSS** : composer via `cn()` (`lib/utils.ts` — `clsx` +
  `tailwind-merge`). Les tokens de design sont documentés dans
  `.claude/rules/design-tokens.md`, chargé automatiquement à l'ouverture d'un
  fichier front.
- **Tests** : Vitest + Testing Library, colocalisés dans un `__tests__/` à côté
  du code testé.
