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
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#0e082e]/30 via-[#0e082e]/45 to-[#0e082e]"
      />

      {/* Subtle indigo glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -left-32 h-[500px] w-[700px] -translate-y-1/2 rounded-full bg-indigo-500/[0.06] blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <FadeOnView className="mb-7 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.06] px-3 py-1.5 text-xs font-medium text-emerald-300 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Disponible
          </span>
          <span className="text-xs text-gray-500">Paris · remote France</span>
        </FadeOnView>

        <FadeOnView
          as="h1"
          className="font-display max-w-4xl text-balance text-[2.5rem] font-bold leading-[1.04] tracking-[-0.025em] text-white sm:text-[3.5rem] md:text-6xl lg:text-[4.75rem]"
          delay={0.05}
        >
          J&apos;ajoute la couche IA à votre{' '}
          <span className="hero-gradient-text">stack web existante</span>.
        </FadeOnView>

        <FadeOnView
          as="p"
          className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 text-pretty sm:text-xl"
          delay={0.1}
        >
          Développeur fullstack freelance à Paris, 4 ans en production. Sans refonte de votre stack.
        </FadeOnView>

        <FadeOnView className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3" delay={0.15}>
          <CalPopupButton
            className="group inline-flex items-center gap-2.5 rounded-full bg-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-[0_0_32px_-8px_rgba(99,102,241,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-[0_0_48px_-8px_rgba(99,102,241,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
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
      </div>
    </section>
  );
}
