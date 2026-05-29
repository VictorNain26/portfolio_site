import Section from '@/components/Section';
import FadeOnView from '@/components/FadeOnView';

/**
 * Pas de témoignage inventé. Le slot "Votre retour ici" sert d'appel à
 * témoignage authentique. À remplir au fur et à mesure des retours clients
 * réels (LinkedIn recommendations, retours mission, captures Slack signées).
 */

export default function Testimonials() {
  return (
    <Section className="scroll-mt-28 pb-20" id="temoignages">
      <FadeOnView className="mb-12 max-w-2xl">
        <p className="label-mono mb-3 text-brand-accent">Retour mission</p>
        <h2 className="heading-2 text-white">On a déjà travaillé ensemble ?</h2>
        <p className="mt-5 text-base leading-relaxed text-gray-400">
          Un retour court sur la collaboration aide énormément les futurs clients à se décider.
          Anonyme si vous préférez.
        </p>
      </FadeOnView>

      <div className="mx-auto max-w-2xl">
        <FadeOnView
          className="flex flex-col items-start gap-5 rounded-2xl border border-dashed border-line-4 bg-surface-1 p-7 text-left"
          delay={0.1}
        >
          <p className="label-mono text-gray-500">Votre retour ici</p>
          <a
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-brand-light transition-colors hover:text-brand-lighter"
            href="mailto:victor.lenain26@gmail.com?subject=Retour%20mission"
          >
            Envoyer un retour →
          </a>
        </FadeOnView>
      </div>
    </Section>
  );
}
