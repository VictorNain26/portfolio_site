import { type ReactNode } from 'react';

/**
 * Wrapper de contenu.
 *
 * Historiquement, le site scrollait dans un conteneur Radix ScrollArea
 * (`#scroll-viewport`) en `height: 100dvh; overflow: hidden`. Ça donnait une
 * jolie scrollbar custom, mais au prix de régressions réelles sur mobile :
 *  - la barre d'URL du navigateur ne se repliait plus au scroll (≈ 60-100px
 *    de hauteur utile perdus en permanence) ;
 *  - pas de restauration de scroll native entre les navigations ;
 *  - momentum iOS, Ctrl+F « scroll-into-view » et ancres externes fragilisés.
 *
 * On revient donc au scroll natif du document. La scrollbar est stylée en CSS
 * (cf. globals.css, desktop uniquement) pour conserver l'esthétique sans aucun
 * de ces coûts. Next.js gère lui-même le reset de scroll à la navigation, et
 * les consommateurs (`HeaderBar`, `BackToTop`, `useFadeOnView`) observent
 * désormais le viewport du document.
 *
 * Composant conservé comme point d'extension et pour ne pas toucher au graphe
 * d'imports du layout.
 */
export default function ScrollView({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
