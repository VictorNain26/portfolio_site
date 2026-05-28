# Design tokens — fondation

Source unique de vérité : le bloc `@theme` de `app/globals.css`.
En Tailwind v4, chaque `--color-*` / `--shadow-*` / `--font-*` y génère
automatiquement les utilities correspondantes (`bg-*`, `text-*`, `border-*`,
`shadow-*`, `font-*`).

> ⚠️ Les valeurs doivent être des couleurs **complètes** (`hsl(...)` / hex /
> `rgb(... / a)`). Un triplet HSL nu (`220 26% 5%`) produit une utility
> invalide — c'est l'ancien bug qui forçait le hardcodé (`#0e082e`, `text-white`).

## Couleurs sémantiques (base shadcn)

| Token | Utility | Rôle |
| --- | --- | --- |
| `--color-background` | `bg-background` | Fond du site (`#0e082e`) |
| `--color-foreground` | `text-foreground` | Texte par défaut |
| `--color-primary` / `-foreground` | `bg-primary` … | Surface claire / texte dessus |
| `--color-muted` / `-foreground` | `text-muted-foreground` | Texte secondaire |
| `--color-border` | `border-border` | Bordure par défaut |
| `--color-ring` | `ring-ring` | Anneau de focus |

## Marque (indigo)

| Token | Hex | = Tailwind | Usage |
| --- | --- | --- | --- |
| `--color-brand` | `#4f46e5` | indigo-600 | Fond CTA |
| `--color-brand-hover` | `#6366f1` | indigo-500 | Hover CTA |
| `--color-brand-accent` | `#818cf8` | indigo-400 | Icônes, eyebrow, focus ring |
| `--color-brand-light` | `#a5b4fc` | indigo-300 | Texte d'accent |
| `--color-brand-foreground` | `#fff` | — | Texte sur fond marque |

Utilities : `bg-brand`, `hover:bg-brand-hover`, `text-brand-accent`,
`focus-visible:ring-brand-accent`…

## Surfaces « glass » (voiles blancs translucides)

Échelle d'élévation pour les cartes sur fond sombre (alpha pré-calculé → rendu
exact, pas de `color-mix`).

| Token | Alpha | Utility |
| --- | --- | --- |
| `--color-surface-muted` | 1.5 % | `bg-surface-muted` |
| `--color-surface-muted-hover` | 3 % | `bg-surface-muted-hover` |
| `--color-surface` | 2.5 % | `bg-surface` |
| `--color-surface-hover` | 4 % | `bg-surface-hover` |
| `--color-surface-elevated` | 6 % | `bg-surface-elevated` |
| `--color-surface-strong` | 8 % | `bg-surface-strong` |

Filets / bordures (même voile, usage bordure) :
`border-hairline-muted` (4 %), `border-hairline-elevated` (6 %),
`border-hairline` (7 %), `border-hairline-strong` (8 %).

## Ombres — halo indigo signature

| Token | Utility |
| --- | --- |
| `--shadow-glow-sm` | `shadow-glow-sm` (CTA compact) |
| `--shadow-glow` | `shadow-glow` (CTA standard) |
| `--shadow-glow-lg` | `shadow-glow-lg` (CTA hover) |

## Typographie & conteneur (`@layer components`)

Classes réutilisables (rendu responsive identique, à appliquer en `className`,
pas via `@apply`) :

- `.container-site` — `mx-auto max-w-7xl` + gouttières du site
- `.text-eyebrow` — sur-titre de section
- `.heading-1` — titre hero (h1)
- `.heading-2` — titre de section (h2)
- `.text-lead` — chapô / accroche

## Reste à migrer (passes ultérieures)

La fondation est posée et `Hero`, `Services`, `HeaderBar`, `Section` + le `body`
l'utilisent. À basculer ensuite sur les mêmes tokens :

- `Projects`, `Process`, `FAQ`, `Contact`, `Footer`, `LatestPosts`,
  les pages `app/services/**` (encore en `#0e082e` / `bg-white/[...]` / ombre inline).
- Teintes indigo **alpha** (`bg-indigo-500/10`, `border-indigo-400/30`…) :
  laissées telles quelles car les tokeniser changerait légèrement le rendu
  (alpha direct vs `color-mix` oklab). À traiter une fois cette nuance acceptée.
- `tailwind.config.js` est aujourd'hui **inerte** (non chargé faute de `@config`
  en v4) : à supprimer dans une passe de nettoyage dédiée.
</content>
</invoke>
