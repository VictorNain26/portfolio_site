---
paths:
  - 'app/**/*.{tsx,css}'
  - 'components/**/*.tsx'
---

# Design tokens

Source unique de vérité : le bloc `@theme` de `app/globals.css`. En Tailwind v4,
chaque `--color-*` / `--shadow-*` / `--font-*` / `--breakpoint-*` y génère
automatiquement l'utility correspondante. Il n'y a **pas** de
`tailwind.config.js` : sans directive `@config`, Tailwind v4 ne le chargerait
pas.

Une valeur de token doit être une couleur **complète** (`hsl(...)`, hex,
`rgb(... / a)`). Un triplet HSL nu comme `220 26% 5%` produit une utility
invalide — c'est le bug d'origine qui avait forcé le hardcodé (`#0e082e`,
`text-white`) dans tout le site.

## Marque (indigo)

| Token              | Hex       | = Tailwind | Usage                            |
| ------------------ | --------- | ---------- | -------------------------------- |
| `brand`            | `#4f46e5` | indigo-600 | Fond CTA                         |
| `brand-hover`      | `#6366f1` | indigo-500 | Hover CTA                        |
| `brand-accent`     | `#818cf8` | indigo-400 | Icônes, eyebrow, anneau de focus |
| `brand-light`      | `#a5b4fc` | indigo-300 | Texte d'accent                   |
| `brand-lighter`    | `#c7d2fe` | indigo-200 | Hover d'accent                   |
| `brand-foreground` | `#fff`    | —          | Texte sur fond marque            |

## Signal chaud (ambre) — co-accent

Système « Encre & Signal » : duotone froid (indigo) / chaud (ambre) sur encre
indigo. Le chaud s'emploie **chirurgicalement** (durées, labels secondaires type
_Contexte_, projet chaud), jamais comme couleur de surface.

| Token         | Hex       | = Tailwind |
| ------------- | --------- | ---------- |
| `warm`        | `#fbbf24` | amber-400  |
| `warm-strong` | `#f59e0b` | amber-500  |

Hiérarchie des teintes : indigo = primaire · ambre = co-accent · emerald =
sémantique (disponible / en production) uniquement. Une seule identité de
gradient (indigo → periwinkle), partout.

## Surfaces « glass »

Échelle d'élévation unique, alpha pré-calculé : `surface-1..5` pour les fonds de
carte sur fond sombre (2 / 3 / 4 / 6 / 8 %), `line-1..5` pour les bordures (4 /
6 / 8 / 10 / 12 %). Ne pas réintroduire de `bg-white/[0.025]` à la main.

## Ombres

`shadow-glow-xs` (pastille d'étape) · `shadow-glow-sm` (CTA compact du header) ·
`shadow-glow` (CTA standard) · `shadow-glow-lg` (CTA au hover).

## Classes de composants

Définies dans `@layer components` de `globals.css`, à appliquer en `className` —
**pas** via `@apply` : `.container-site`, `.label-mono`, `.heading-1`,
`.heading-2`, `.text-lead`.

## Règle : tokens vs couleurs brutes

- **Tout l'indigo passe par les tokens `brand-*`**, y compris les variantes à
  opacité (`bg-brand-hover/10`, `border-brand-accent/30`,
  `via-brand-accent/40`). `indigo-400/30` ≡ `brand-accent/30` : même couleur,
  aucune raison de laisser de l'indigo brut.
- **Seules les teintes décoratives non-marque restent en Tailwind brut** :
  violet/purple (dégradé avatar), rose, ambre hors token `warm`, emerald
  (sémantique). Ce sont des hues illustratives sans token dédié.
