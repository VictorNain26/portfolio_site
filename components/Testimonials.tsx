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
        <p className="mb-3 font-display text-sm font-medium tracking-[0.18em] text-brand-accent uppercase">
          Retour mission
        </p>
        <h2 className="font-display text-3xl leading-[1.1] font-bold text-white sm:text-4xl lg:text-5xl">
          On a déjà travaillé ensemble ?
        </h2>
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
          <p className="text-[11px] font-medium tracking-[0.18em] text-gray-500 uppercase">
            Votre retour ici
          </p>
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
