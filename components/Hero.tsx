'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, ArrowRight, MessageCircle } from 'lucide-react';
import CalPopupButton from '@/components/CalPopupButton';

const metrics = [
  { value: '4+', label: "ans d'expérience" },
  { value: '20+', label: 'projets livrés' },
  { value: '<24h', label: 'temps de réponse' },
];

export default function Hero() {
  const reduced = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 } as const,
          whileInView: { opacity: 1, y: 0 } as const,
          viewport: { once: true } as const,
          transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 sm:px-8"
      id="accueil"
    >
      {/* --- Subtle glow accent (blends with body bg) --- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/[0.04] blur-[150px]" />
      </div>

      {/* --- Content --- */}
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Availability badge */}
        <motion.div {...fadeUp(0)} className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-green-500/20 bg-green-500/5 px-4 py-2 text-sm font-medium text-green-400 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            Disponible pour une mission
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.05)}
          className="font-display text-[2.5rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[5rem]"
        >
          Votre projet web,{' '}
          <span className="hero-gradient-text">livré</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.1)}
          className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-400 text-balance sm:mt-6 sm:text-xl"
        >
          Développeur Full-Stack &amp; DevOps freelance à Paris.{' '}
          <span className="text-gray-300">
            Création, refonte, intervention ponctuelle
          </span>{' '}
          — des solutions complètes, pas juste du code.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.15)}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <CalPopupButton
            className="group relative inline-flex items-center gap-3 rounded-full bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-[0_0_32px_-8px_rgba(99,102,241,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-[0_0_48px_-8px_rgba(99,102,241,0.6)] focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            data-umami-event="cta-hero-cal"
          >
            <Calendar aria-hidden="true" className="h-5 w-5" />
            Réserver un échange gratuit
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </CalPopupButton>

          <a
            className="group inline-flex items-center gap-2.5 rounded-full border border-gray-700/50 bg-white/[0.03] px-7 py-4 text-base font-medium text-gray-300 backdrop-blur-sm transition-all duration-300 hover:border-gray-500/50 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            data-umami-event="cta-hero-whatsapp"
            href="https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous"
            rel="noopener noreferrer"
            target="_blank"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            Ou par WhatsApp
          </a>
        </motion.div>

        {/* Metrics */}
        <motion.div
          {...fadeUp(0.25)}
          className="mx-auto mt-10 grid max-w-lg grid-cols-3 divide-x divide-gray-800/60"
        >
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              className="px-4 text-center sm:px-6"
              {...(reduced
                ? {}
                : {
                    initial: { opacity: 0, scale: 0.8 } as const,
                    whileInView: { opacity: 1, scale: 1 } as const,
                    viewport: { once: true } as const,
                    transition: {
                      duration: 0.4,
                      delay: 0.35 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1] as const,
                    },
                  })}
            >
              <div className="font-display text-2xl font-bold text-white sm:text-3xl">
                {metric.value}
              </div>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-gray-500 sm:text-xs">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Credibility bar */}
        <motion.div
          {...fadeUp(0.4)}
          className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-gray-500"
        >
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-indigo-500/60" />
            Ex-Capsens (fintech)
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-indigo-500/60" />
            React, Next.js, Node.js, TypeScript
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-indigo-500/60" />
            Docker &amp; CI/CD
          </span>
        </motion.div>
      </div>

      {/* --- Scroll indicator --- */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        {...(reduced
          ? {}
          : {
              initial: { opacity: 0 } as const,
              animate: { opacity: 1 } as const,
              transition: { delay: 0.8, duration: 0.6 },
            })}
      >
        <div className="flex h-9 w-[22px] items-start justify-center rounded-full border border-gray-700/40 p-1.5">
          <motion.span
            className="h-2 w-1 rounded-full bg-gray-600"
            {...(reduced
              ? {}
              : {
                  animate: { y: [0, 10, 0] } as const,
                  transition: {
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut' as const,
                  },
                })}
          />
        </div>
      </motion.div>
    </section>
  );
}
