import Section from '@/components/Section';
import FadeOnView from '@/components/FadeOnView';

/**
 * Preuve sociale SANS témoignage inventé. Tant qu'il n'y a pas de retour
 * client réel, on s'appuie sur des faits vérifiables déjà vrais ailleurs sur
 * le site (produits en prod, expérience, code open-source, réactivité) —
 * une preuve factuelle convertit mieux qu'un encart « témoignage » vide.
 * Le bloc d'invitation reste pour collecter de vrais retours, à afficher
 * ici dès qu'ils existent (recommandations LinkedIn, retours mission signés).
 */

const proofs: { stat: string; label: string; detail: string }[] = [
  {
    stat: '2',
    label: 'produits IA livrés en solo',
    detail: 'AubeSonore en production depuis 2025, TomIA en pré-prod pour 2026.',
  },
  {
    stat: '4 ans',
    label: 'de code en production',
    detail: 'Dont 2 ans en Rails chez Capsens (fintech, 2022-2024).',
  },
  {
    stat: 'Open source',
    label: 'briques vérifiables avant signature',
    detail: 'Serveur MCP, démo RAG, pipeline d’eval — lisibles publiquement.',
  },
  {
    stat: '< 24 h',
    label: 'délai de réponse',
    detail: 'Réponse sous 24 h ouvrées, démarrage sous 1 à 2 semaines.',
  },
];

export default function Testimonials() {
  return (
    <Section className="scroll-mt-28 pb-20" id="temoignages">
      <FadeOnView className="mb-12 max-w-2xl">
        <p className="label-mono mb-3 text-brand-accent">Preuve</p>
        <h2 className="heading-2 text-white">Ce qui tourne déjà, pour de vrai.</h2>
        <p className="mt-5 text-base leading-relaxed text-gray-400">
          Pas de logo client ni de témoignage inventé. Juste des faits vérifiables — du code en
          production et lisible avant qu&apos;on signe quoi que ce soit.
        </p>
      </FadeOnView>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {proofs.map((p, i) => (
          <FadeOnView
            key={p.label}
            className="flex flex-col gap-2 rounded-2xl border border-line-2 bg-surface-1 p-6 backdrop-blur-sm"
            delay={0.05 + i * 0.05}
          >
            <span className="font-display text-3xl font-bold text-white sm:text-4xl">{p.stat}</span>
            <span className="text-sm font-semibold text-brand-light">{p.label}</span>
            <span className="text-xs leading-relaxed text-gray-500">{p.detail}</span>
          </FadeOnView>
        ))}
      </div>

      {/* Invitation à un vrai retour client — remplacera/complétera ce bloc
       * dès qu'un témoignage signé est disponible. */}
      <FadeOnView
        className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-line-4 bg-surface-1 p-6 sm:flex-row sm:items-center"
        delay={0.25}
      >
        <p className="text-sm leading-relaxed text-gray-400">
          On a déjà travaillé ensemble ? Un retour court aide les prochains clients à se décider —
          anonyme si vous préférez.
        </p>
        <a
          className="inline-flex w-fit shrink-0 items-center gap-1.5 text-sm font-medium text-brand-light transition-colors hover:text-brand-lighter"
          href="mailto:victor.lenain26@gmail.com?subject=Retour%20mission"
        >
          Envoyer un retour →
        </a>
      </FadeOnView>
    </Section>
  );
}
