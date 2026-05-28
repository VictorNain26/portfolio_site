# Design tokens — fondation

Source unique de vérité : le bloc `@theme` de `app/globals.css`. En Tailwind v4,
chaque `--color-*` / `--shadow-*` / `--font-*` / `--breakpoint-*` y génère
automatiquement les utilities correspondantes (`bg-*`, `text-*`, `border-*`,
`shadow-*`, `font-*`, `xs:`…).

> ⚠️ Les valeurs doivent être des couleurs **complètes** (`hsl(...)` / hex /
> `rgb(... / a)`). Un triplet HSL nu (`220 26% 5%`) produit une utility invalide
> — c'est l'ancien bug qui forçait le hardcodé (`#0e082e`, `text-white`).

## Couleurs sémantiques (base shadcn)

| Token                             | Utility                 | Rôle                                    |
| --------------------------------- | ----------------------- | --------------------------------------- |
| `--color-background`              | `bg-background`         | Fond du site — encre indigo (`#0B0B1C`) |
| `--color-foreground`              | `text-foreground`       | Texte par défaut                        |
| `--color-primary` / `-foreground` | `bg-primary` …          | Surface claire / texte dessus           |
| `--color-muted` / `-foreground`   | `text-muted-foreground` | Texte secondaire                        |
| `--color-border`                  | `border-border`         | Bordure par défaut                      |
| `--color-ring`                    | `ring-ring`             | Anneau de focus                         |

## Marque (indigo)

| Token                      | Hex       | = Tailwind | Usage                       |
| -------------------------- | --------- | ---------- | --------------------------- |
| `--color-brand`            | `#4f46e5` | indigo-600 | Fond CTA                    |
| `--color-brand-hover`      | `#6366f1` | indigo-500 | Hover CTA                   |
| `--color-brand-accent`     | `#818cf8` | indigo-400 | Icônes, eyebrow, focus ring |
| `--color-brand-light`      | `#a5b4fc` | indigo-300 | Texte d'accent              |
| `--color-brand-lighter`    | `#c7d2fe` | indigo-200 | Hover d'accent              |
| `--color-brand-foreground` | `#fff`    | —          | Texte sur fond marque       |

Utilities : `bg-brand`, `hover:bg-brand-hover`, `text-brand-accent`,
`focus-visible:ring-brand-accent`, `bg-brand/90`…

## Signal chaud (ambre) — co-accent

Système **« Encre & Signal »** : duotone froid (indigo) / chaud (ambre) sur
encre indigo. Le chaud est employé **chirurgicalement** (durées, labels
secondaires type _Contexte_, projet chaud) pour la chaleur et la différenciation
— la plupart des sites dev restent 100 % froids.

| Token                 | Hex       | = Tailwind | Usage                                    |
| --------------------- | --------- | ---------- | ---------------------------------------- |
| `--color-warm`        | `#fbbf24` | amber-400  | Accent chaud (`text-warm`, `bg-warm/80`) |
| `--color-warm-strong` | `#f59e0b` | amber-500  | Variante appuyée                         |

> **Hiérarchie des teintes** : indigo = primaire · ambre = co-accent · emerald =
> sémantique (disponible / en production) uniquement. Une seule identité de
> gradient (indigo → periwinkle), partout.

## Surfaces « glass » (voiles blancs translucides)

Échelle d'élévation **unique** pour les fonds (`surface-*`) et les bordures
(`line-*`) des cartes sur fond sombre. Alpha pré-calculé → rendu exact.

| Token               | Alpha | Utility        | Token            | Alpha | Utility         |
| ------------------- | ----- | -------------- | ---------------- | ----- | --------------- |
| `--color-surface-1` | 2 %   | `bg-surface-1` | `--color-line-1` | 4 %   | `border-line-1` |
| `--color-surface-2` | 3 %   | `bg-surface-2` | `--color-line-2` | 6 %   | `border-line-2` |
| `--color-surface-3` | 4 %   | `bg-surface-3` | `--color-line-3` | 8 %   | `border-line-3` |
| `--color-surface-4` | 6 %   | `bg-surface-4` | `--color-line-4` | 10 %  | `border-line-4` |
| `--color-surface-5` | 8 %   | `bg-surface-5` | `--color-line-5` | 12 %  | `border-line-5` |

> Quelques quasi-doublons d'origine (0.015/0.02/0.025 ; 0.06/0.07) ont été
> regroupés : la différence d'alpha est sub-perceptible, le vocabulaire reste
> net.

## Ombres — halo indigo signature

| Token              | Utility          | Usage                         |
| ------------------ | ---------------- | ----------------------------- |
| `--shadow-glow-xs` | `shadow-glow-xs` | Petit halo (pastille d'étape) |
| `--shadow-glow-sm` | `shadow-glow-sm` | CTA compact (header)          |
| `--shadow-glow`    | `shadow-glow`    | CTA standard                  |
| `--shadow-glow-lg` | `shadow-glow-lg` | CTA au hover                  |

## Typographie & conteneur (`@layer components`)

Classes réutilisables (rendu responsive identique, à appliquer en `className`,
pas via `@apply`) :

- `.container-site` — `mx-auto max-w-7xl` + gouttières du site
- `.label-mono` — label technique monospace (numéros de section, métadonnées)
- `.heading-1` — titre hero (h1)
- `.heading-2` — titre de section (h2)
- `.text-lead` — chapô / accroche

## Convention : tokens vs couleurs brutes

- **Tout l'indigo passe par les tokens `brand-*`** — y compris les variantes à
  opacité (`bg-brand-hover/10`, `border-brand-accent/30`,
  `via-brand-accent/40`…). C'est exact : `indigo-400/30` ≡ `brand-accent/30`
  (même couleur, même `color-mix`), donc aucune raison de laisser de l'indigo
  brut.
- **Seules les teintes décoratives non-marque restent en Tailwind brut** :
  violet/purple (dégradé avatar), rose, ambre (hors token `warm`), emerald
  (sémantique). Ce sont des hues sans token dédié, illustratives.

## Notes

- `tailwind.config.js` a été **supprimé** : il était inerte en Tailwind v4 (non
  chargé faute de `@config`). Ses réglages utiles ont migré dans `@theme`
  (`--breakpoint-xs`, polices) ; le plugin `@tailwindcss/typography` n'était de
  toute façon pas actif (les styles `.prose` viennent de `globals.css`).
- Tout le site (sections homepage, pages `services`, `blog`, article, header,
  footer) utilise désormais ces tokens : **aucune couleur de marque ni surface
  en dur** ne subsiste.
