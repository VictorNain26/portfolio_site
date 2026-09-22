# Refonte victorlenain.fr — Astro, « Papier & encre »

Date : 2026-09-22 · Branche : `feat/astro-rebuild`

## Objectif

Remplacer le site Next.js actuel (8 sections, header de 346 lignes, thème
sombre indigo « glass ») par un site statique minimal : une homepage d'un
écran, une page projets, le blog. Charte éditoriale claire, animations peu
nombreuses mais soignées.

Critères de succès :

- Homepage lisible en un écran sur desktop et mobile, sans scroll nécessaire.
- Les 16 URLs `/blog/<slug>` existantes répondent à l'identique.
- `/services` et `/services/<slug>` redirigent en 301 vers `/`.
- Build Vercel vert, sans Bun dans la chaîne.
- Aucun JS client hors analytics et deux micro-scripts d'animation optionnels.

## Stack

| Élément         | Choix                                   | Source                                                                             |
| --------------- | --------------------------------------- | ---------------------------------------------------------------------------------- |
| Framework       | Astro 7 (7.3.4 au 2026-09-22), statique | https://docs.astro.build/en/concepts/why-astro/                                    |
| Contenu         | Content collections, `glob` loader      | https://docs.astro.build/en/guides/content-collections/                            |
| MDX             | `@astrojs/mdx`                          | idem                                                                               |
| Sitemap         | `@astrojs/sitemap`                      | à confirmer dans le plan                                                           |
| Polices         | Fonts API Astro, provider Google        | https://docs.astro.build/en/guides/fonts/                                          |
| Styles          | CSS natif (custom properties), pas de Tailwind | —                                                                           |
| Déploiement     | Vercel, statique, sans adapter          | https://docs.astro.build/en/guides/deploy/vercel/                                  |
| Redirections    | `vercel.json` `redirects`, `statusCode: 301` | https://vercel.com/docs/project-configuration/vercel-json#redirects           |
| Gestionnaire    | pnpm + Node (Bun retiré du repo)        | support pnpm 12 par Vercel à vérifier dans le plan                                 |
| Qualité         | `astro check`, Prettier + `prettier-plugin-astro`, Vitest pour `src/lib` | —                               |

Pas de React, pas de Framer Motion, pas d'ESLint/Oxlint : il n'y a quasiment
pas de JS à linter, `astro check` couvre le typage des `.astro` et du TS.

Les redirections Astro (`redirects` dans `astro.config`) ne sont pas utilisées :
en statique sans adapter elles produisent des meta refresh, pas des 301
(https://docs.astro.build/en/reference/configuration-reference/#redirects).

## Structure

```
src/
  content.config.ts        # collection posts
  content/posts/*.mdx      # les 16 articles, déplacés tels quels
  data/projects.ts         # projets en dur
  lib/posts.ts             # publiés + tri (testé)
  layouts/Base.astro       # <head>, polices, header minimal, footer
  layouts/Article.astro
  pages/index.astro
  pages/projets.astro
  pages/blog/index.astro
  pages/blog/[slug].astro
  pages/404.astro
  styles/global.css        # tokens + reset + typo
public/
  og.png, favicon, apple-icon, manifest, llms.txt
vercel.json
astro.config.mjs
```

Tout le reste du repo actuel est supprimé (voir « Suppressions »).

## Pages

**`/`** — un écran :

- Nom « Victor Lenain » en très grand (serif).
- Une phrase de positionnement (reprise et resserrée de la metadata actuelle :
  full-stack freelance à Paris, intégration IA sur une stack existante).
- Index vertical : `Projets →`, `Blog →`, `Prendre rendez-vous ↗` (Cal.com),
  `Écrire ↗` (mailto).
- Pied discret : LinkedIn, GitHub, Malt.

**`/projets`** — liste éditoriale écrite à la main dans `src/data/projects.ts`
(nom, une ligne, stack courte, lien). Départ : AubeSonore et TomIA, contenus
repris de `components/Projects.tsx`. Pas d'image. La récupération GitHub
(`lib/github.ts`, déjà inutilisée) disparaît.

**`/blog`** — liste chronologique : date, titre, résumé. Pas de tags affichés.

**`/blog/<slug>`** — article : titre, date, corps MDX en colonne de lecture
(~65ch), lien retour. Blocs de code stylés via le highlight intégré d'Astro
(thème clair accordé à la palette).

**`404`** — une ligne et un lien vers `/`.

Header sur les sous-pages : « Victor Lenain » (lien `/`) à gauche, `Projets`
et `Blog` à droite. Pas de menu mobile : trois liens tiennent sur 360px.

## Charte « Papier & encre »

Tokens dans `global.css` :

| Token          | Valeur    | Usage                              |
| -------------- | --------- | ---------------------------------- |
| `--paper`      | `#F2EFE8` | fond                               |
| `--ink`        | `#16140F` | texte                              |
| `--ink-soft`   | `#5E594F` | dates, métadonnées                 |
| `--rule`       | `#D9D3C7` | filets                             |
| `--accent`     | `#E4412B` | liens au survol, sélection, focus  |

Contraste texte : `--ink` et `--ink-soft` sur `--paper` doivent passer AA ; le
vermillon n'est jamais utilisé pour du texte courant. Vérification chiffrée dans
le plan.

Thème clair uniquement (`color-scheme: light`, `theme-color` `#F2EFE8`).

Typographie :

- Display : **Instrument Serif** (nom, titres d'article, lignes de l'index).
- Texte : **Inter Tight**.
- Mono : aucun ajout ; le code utilise la pile système `ui-monospace`.

Présence dans le catalogue Google Fonts vérifiée le 2026-09-22.

Échelle : nom en `clamp()` jusqu'à ~9rem, corps 1.0625rem / 1.6. Beaucoup
d'espace, grille à une colonne, aucune carte, aucune ombre, aucun dégradé.

Grain papier : un bruit SVG inline en `background-image` à très faible opacité.

## Animations

Toutes en CSS, désactivées sous `prefers-reduced-motion: reduce`.

1. **Entrée du nom** : chaque mot monte depuis un masque (`overflow: clip`,
   `translateY` 100% → 0), décalage de ~80ms, ~700ms, easing
   `cubic-bezier(.2,.7,0,1)`. La phrase et l'index suivent en fondu.
2. **Index au survol / focus** : la ligne passe en Instrument Serif italique
   vermillon, la flèche glisse de quelques pixels, le soulignement se trace de
   gauche à droite (`background-size` animé).
3. **Liens dans le texte** : même soulignement tracé.
4. **Transitions de page** : `@view-transition { navigation: auto; }`,
   amélioration progressive (non Baseline selon MDN, les navigateurs sans
   support naviguent normalement),
   https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition

Aucun JS d'animation.

## Contenu et migration

- Les 16 `.mdx` sont déplacés dans `src/content/posts/` sans modification de
  fond. Schéma : `title`, `summary`, `publishedAt` (date), `tags` (défaut `[]`,
  conservé dans le schéma mais non affiché).
- Slug = nom de fichier sans extension, comme aujourd'hui.
- Un article dont `publishedAt` est dans le futur n'est pas généré. En statique,
  la publication différée demande un redéploiement : on publie en mergeant.
- Les composants MDX spécifiques à Next (`next/image`, `next/link`, `Badge`)
  sont remplacés par du HTML standard ; la migration vérifie que chaque article
  se rend sans composant manquant.

## SEO

- `site: 'https://victorlenain.fr'` dans `astro.config`.
- Title, description, canonical, Open Graph et Twitter via `Base.astro`.
  Textes repris de `app/layout.tsx`.
- JSON-LD : `Person` (repris de `metadata-config.ts`, `sameAs` inclus) sur
  toutes les pages, `BlogPosting` sur les articles. Le schéma `FAQPage`
  disparaît avec la FAQ.
- Sitemap généré, `robots.txt` statique qui le référence.
- Image Open Graph : **une seule image statique** `og.png` aux couleurs de la
  charte. Les images OG par article générées dynamiquement ne sont pas reprises.
- `llms.txt` mis à jour (plus de services).
- Redirections 301 dans `vercel.json` :
  `/services` → `/` et `/services/:path*` → `/`.

## Tiers

- Umami : même script, même `data-website-id`.
- Cal.com : lien direct vers `https://cal.com/victor-lenain-ejsjfb/echange-decouverte`
  (plus d'embed JS).
- Contact : mailto uniquement ; WhatsApp retiré (choix par défaut, à confirmer
  à la relecture).

## Suppressions

Tout le code Next.js : `app/`, `components/`, `hooks/`, `lib/`,
`content-collections.ts`, `next.config.*`, `eslint.config.mjs`, `.oxlintrc.json`,
`global.d.ts`, `next-env.d.ts`, `bun.lock`, les tests existants, et
`public/images/hero-bg.webp`.

Également retirés : la page et les données Services, FAQ, témoignages, process,
le script IndexNow (`scripts/notify-search-engines.ts`, `lib/indexnow.ts`) et
son fichier clé dans `public/`.

`CLAUDE.md` est réécrit pour la nouvelle stack.

## Tests et validation

- Vitest sur `src/lib/posts.ts` (filtre des articles futurs, tri).
- `astro check` et `astro build` sans erreur.
- Contrôle du build : les 16 slugs existent dans `dist/blog/`, `sitemap` les
  contient, aucune page `services` n'est générée.
- Preview Vercel : `curl -I` sur `/services/agents-ia` renvoie 301 vers `/`,
  un article renvoie 200.
- Lighthouse sur la preview : accessibilité et SEO à 100, performance ≥ 95
  mobile.
- Vérification manuelle `prefers-reduced-motion`.

## Livraison

- Une PR `feat/astro-rebuild` vers `master` ; le merge déploie en production
  sur le même projet Vercel (`portfolio-site`), domaine inchangé.
- Méthode de merge proposée à la fin selon l'état des commits.
- Hors périmètre : la PR #68 (`chore/config-cleanup`) est rendue obsolète et
  sera fermée sans merge ; la branche jetable `bisect/deps-bump` sera supprimée.
  Les deux sur confirmation.
