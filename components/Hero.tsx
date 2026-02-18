'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, ArrowRight, Check } from 'lucide-react';
import CalPopupButton from '@/components/CalPopupButton';

const stack = ['React', 'Next.js', 'Node.js', 'TypeScript', 'Docker', 'CI/CD'];

const statusLines = [
  { label: 'Build', value: 'passed' },
  { label: 'Tests', value: '100%' },
  { label: 'Deploy', value: 'production' },
  { label: 'Suivi', value: 'actif' },
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
          transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as const },
        };

  const fadeIn = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0 } as const,
          whileInView: { opacity: 1 } as const,
          viewport: { once: true } as const,
          transition: { duration: 0.8, delay },
        };

  return (
    <section
      className="relative flex min-h-[100svh] items-center overflow-hidden px-4 sm:px-8 lg:px-20"
      id="accueil"
    >
      {/* --- Decorative background layers --- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(129,140,248,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(129,140,248,.6) 1px,transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/3 h-[560px] w-[560px] rounded-full bg-indigo-600/[0.07] blur-[140px]"
      />

      {/* --- Content --- */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16 xl:gap-24">
        {/* Left — text content */}
        <div className="flex-1">
          {/* Availability badge */}
          <motion.div {...fadeUp(0.1)} className="mb-8">
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
            {...fadeUp(0.2)}
            className="font-display mb-6 text-4xl font-bold leading-[1.08] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl"
          >
            De l&apos;idée au{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              déploiement
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.3)}
            className="mb-10 max-w-lg text-lg leading-relaxed text-gray-400"
          >
            Développeur Full-Stack &amp; DevOps freelance à Paris.{' '}
            <span className="text-gray-300">
              Applications web, APIs, infrastructure
            </span>{' '}
            — je livre des solutions complètes, pas juste du code.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.4)} className="flex flex-wrap items-center gap-4">
            <CalPopupButton
              className="group inline-flex items-center gap-3 rounded-full bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/30 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              data-umami-event="cta-hero-cal"
            >
              <Calendar aria-hidden="true" className="h-4 w-4" />
              Réserver un échange gratuit
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              />
            </CalPopupButton>

            <a
              className="inline-flex items-center gap-2 rounded-full border border-gray-700/50 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-gray-400 backdrop-blur-sm transition-colors hover:border-gray-600 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              data-umami-event="cta-hero-whatsapp"
              href="https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous"
              rel="noopener noreferrer"
              target="_blank"
            >
              Ou par WhatsApp
            </a>
          </motion.div>

          {/* Tech stack trust bar */}
          <motion.div
            {...fadeUp(0.55)}
            className="mt-12 flex flex-wrap items-center gap-2"
          >
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-widest text-gray-600">
              Stack
            </span>
            {stack.map((tech, i) => (
              <motion.span
                key={tech}
                className="rounded-full border border-gray-800/80 bg-gray-900/40 px-3 py-1 text-xs text-gray-500 backdrop-blur-sm transition-colors hover:border-indigo-500/30 hover:text-gray-300"
                {...(reduced
                  ? {}
                  : {
                      initial: { opacity: 0, scale: 0.85 } as const,
                      whileInView: { opacity: 1, scale: 1 } as const,
                      viewport: { once: true } as const,
                      transition: { duration: 0.3, delay: 0.65 + i * 0.06 },
                    })}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Right — status card */}
        <motion.div
          {...fadeIn(0.5)}
          aria-hidden="true"
          className="hidden w-full max-w-sm shrink-0 md:block lg:w-[340px] xl:w-[380px]"
        >
          <div className="relative rounded-2xl border border-gray-800/60 bg-gray-900/30 p-6 backdrop-blur-md sm:p-7">
            {/* Terminal dots + filename */}
            <div className="mb-6 flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
                <span className="h-3 w-3 rounded-full bg-green-400/70" />
              </div>
              <span className="ml-auto font-mono text-xs tracking-wider text-gray-600">
                deploy.sh
              </span>
            </div>

            {/* Status lines */}
            <div className="space-y-4">
              {statusLines.map((line, i) => (
                <motion.div
                  key={line.label}
                  className="flex items-center justify-between"
                  {...(reduced
                    ? {}
                    : {
                        initial: { opacity: 0, x: 12 } as const,
                        whileInView: { opacity: 1, x: 0 } as const,
                        viewport: { once: true } as const,
                        transition: { duration: 0.4, delay: 0.7 + i * 0.1 },
                      })}
                >
                  <span className="font-mono text-sm text-gray-500">
                    {line.label}
                  </span>
                  <span className="flex items-center gap-2 font-mono text-sm text-green-400/90">
                    <Check className="h-3.5 w-3.5" />
                    {line.value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="my-5 h-px bg-gradient-to-r from-transparent via-gray-700/60 to-transparent" />

            {/* Availability */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-gray-600">
                Disponibilité
              </span>
              <span className="font-mono text-sm font-semibold text-indigo-400">
                sous 48h
              </span>
            </div>

            {/* Card glow */}
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-indigo-500/[0.08] via-transparent to-transparent" />
          </div>
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
              transition: { delay: 1.4, duration: 0.8 },
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
