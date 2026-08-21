'use client';

import { type MouseEvent, type ReactNode } from 'react';

import { CAL_LINK, CAL_ORIGIN, CAL_URL } from '@/lib/cal';

type CalPopupButtonProps = {
  children: ReactNode;
  className?: string;
  'data-umami-event'?: string;
};

/**
 * CTA de réservation : vrai `<a href>` vers Cal.com, surclassé en modale inline
 * dès que l'embed est chargé. Sans JS, ou avant la fin du chargement, le lien
 * reste fonctionnel.
 *
 * La modale est ouverte explicitement plutôt que via l'attribut `data-cal-link`.
 * Le listener global d'embed.js qui gère cet attribut n'appelle pas
 * `preventDefault()` : sur un `<a target="_blank">` il ouvrait la modale *et*
 * laissait le navigateur ouvrir un onglet.
 */
export default function CalPopupButton({ children, className, ...rest }: CalPopupButtonProps) {
  const openModal = (event: MouseEvent<HTMLAnchorElement>) => {
    // Clic modifié : on laisse le navigateur ouvrir l'onglet, comme attendu.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!window.Cal?.instance) return;

    event.preventDefault();
    window.Cal('modal', {
      calLink: CAL_LINK,
      calOrigin: CAL_ORIGIN,
      config: { layout: 'month_view', theme: 'dark' },
    });
  };

  return (
    <a
      {...rest}
      className={className}
      href={CAL_URL}
      onClick={openModal}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
