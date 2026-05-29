import { type ReactNode } from 'react';

/* Lien Cal.com. `CAL_LINK` = chemin public (namespace/event), consommé par
 * l'embed pour ouvrir la réservation en MODALE inline (cf. CalEmbedScript).
 * On reste sur un vrai `<a href>` : si le script d'embed n'est pas encore
 * chargé (ou échoue), le clic ouvre Cal dans un onglet comme avant —
 * amélioration progressive, jamais de régression sur le CTA principal. */
const CAL_LINK = 'victor-lenain-ejsjfb/echange-decouverte';
const CAL_URL = `https://cal.com/${CAL_LINK}?theme=dark&layout=month_view`;

type CalPopupButtonProps = {
  children: ReactNode;
  className?: string;
  'data-umami-event'?: string;
};

export default function CalPopupButton({ children, className, ...rest }: CalPopupButtonProps) {
  return (
    <a
      {...rest}
      className={className}
      data-cal-config='{"layout":"month_view","theme":"dark"}'
      data-cal-link={CAL_LINK}
      href={CAL_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
