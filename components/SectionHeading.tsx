import { type ReactNode } from 'react';
import FadeOnView from '@/components/FadeOnView';
import { cn } from '@/lib/utils';

type Props = {
  /** Index documentaire de la section, ex. "01". */
  index: string;
  /** Libellé court de la section, ex. "Services" (rendu en mono majuscules). */
  label: string;
  title: ReactNode;
  /** Texte d'accroche optionnel sous le titre. */
  lead?: ReactNode;
  /** Contenu optionnel aligné à droite sur desktop (lien « voir tout »…). */
  aside?: ReactNode;
  className?: string;
};

/**
 * En-tête de section éditorial-technique : une ligne de repère en monospace
 * `(01) SERVICES` prolongée d'un filet, puis le titre. Unifie toutes les
 * sections de la homepage autour d'un même vocabulaire « documentaire ».
 */
export default function SectionHeading({ index, label, title, lead, aside, className }: Props) {
  return (
    <FadeOnView
      className={cn(
        'mb-14',
        aside && 'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between',
        className,
      )}
    >
      <div className="max-w-2xl">
        {/* Repère documentaire : numéro + label mono, prolongé d'un filet. */}
        <div className="mb-5 flex items-center gap-4">
          <span className="label-mono text-brand-accent">
            {index}
            <span className="mx-2 text-gray-600">/</span>
            {label}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-line-2" />
        </div>

        <h2 className="heading-2 text-balance text-white">{title}</h2>

        {lead ? <p className="text-lead mt-5 text-pretty text-gray-400">{lead}</p> : null}
      </div>

      {aside ? <div className="shrink-0">{aside}</div> : null}
    </FadeOnView>
  );
}
