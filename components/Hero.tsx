import { Calendar, ArrowRight } from 'lucide-react';
import CalPopupButton from '@/components/CalPopupButton';
import FadeOnView from '@/components/FadeOnView';

export default function Hero() {
  return (
    <section
      className="relative flex min-h-[82vh] items-center overflow-hidden px-4 pt-28 pb-16 sm:px-8 sm:pt-32 lg:pt-36"
      id="accueil"
    >
      {/* Background image scopée au Hero pour rester immersive en haut,
       * le reste du site profite d'un fond uni sombre clean. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[url('/images/hero-bg.webp')] bg-cover bg-center bg-no-repeat"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/30 via-background/45 to-background"
      />

      {/* Subtle indigo glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -left-32 h-[500px] w-[700px] -translate-y-1/2 rounded-full bg-brand-hover/[0.06] blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        {/* Rail haut : ligne de statut en monospace (signature documentaire). */}
        <FadeOnView className="label-mono mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-400">
          <span className="inline-flex items-center gap-2 text-emerald-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Disponible
          </span>
          <span aria-hidden="true" className="text-gray-700">
            /
          </span>
          <span>Paris — Remote France</span>
        </FadeOnView>

        <FadeOnView as="h1" className="heading-1 max-w-4xl text-balance text-white" delay={0.05}>
          J&apos;ajoute la couche IA à votre{' '}
          <span className="hero-gradient-text">stack web existante</span>.
        </FadeOnView>

        <FadeOnView
          as="p"
          className="text-lead mt-6 max-w-2xl text-pretty text-gray-300 sm:text-xl"
          delay={0.1}
        >
          Développeur full-stack freelance à Paris, 4 ans en production. Sans refonte de votre stack.
        </FadeOnView>

        <FadeOnView className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3" delay={0.15}>
          <CalPopupButton
            className="group inline-flex items-center gap-2.5 rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-glow-lg focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none"
            data-umami-event="cta-hero-cal"
          >
            <Calendar aria-hidden="true" className="h-4 w-4" />
            Réserver un échange
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </CalPopupButton>

          <a
            className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            data-umami-event="cta-hero-whatsapp"
            href="https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous"
            rel="noopener noreferrer"
            target="_blank"
          >
            ou par WhatsApp →
          </a>
        </FadeOnView>

        {/* Rail bas : « fiche technique » en monospace, prolongée d'un filet. */}
        <FadeOnView
          className="mt-14 flex items-center gap-4 border-t border-line-2 pt-6"
          delay={0.2}
        >
          <p className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1.5 text-gray-500">
            <span>Full-stack + IA</span>
            <span aria-hidden="true" className="text-gray-700">
              ·
            </span>
            <span>4 ans en prod</span>
            <span aria-hidden="true" className="text-gray-700">
              ·
            </span>
            <span className="text-gray-400">Next / Django / Rails / FastAPI</span>
          </p>
        </FadeOnView>
      </div>
    </section>
  );
}
