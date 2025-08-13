'use client';

import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Mail } from 'lucide-react';
import { FaWhatsapp, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SocialIconButton } from '@/components/ui/social-icon-button';

// Animation constants for performance optimization
const ANIMATION_DURATION = 0.5;
const BEZIER_START = 0.25;
const BEZIER_MID_LOW = 0.1;
const BEZIER_MID_HIGH = 0.25;
const BEZIER_END = 1;
const BEZIER_CURVE = [BEZIER_START, BEZIER_MID_LOW, BEZIER_MID_HIGH, BEZIER_END] as const;
const INITIAL_DELAY = 0.2;

const ModelHero = dynamic(async () => import('@/components/ModelHeroFast'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-pulse rounded-full bg-indigo-500/20" />
    </div>
  ),
});

export default function Hero() {
  const prefersReduceMotion = useReducedMotion();

  return (
    <section
      className="relative flex min-h-[100svh] flex-col items-center overflow-hidden pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-0"
      id="accueil"
    >
      {/* ── Contenu principal ─────────────────────────────────────── */}
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-0 sm:items-center sm:gap-10 sm:px-8 lg:grid lg:min-h-[70vh] lg:grid-cols-2 lg:place-items-center lg:gap-16 lg:px-20">
        {/* Titre + tagline */}
        <motion.header
          className="order-1 flex flex-col sm:items-center lg:order-none lg:items-start"
          // Reduced movement for better mobile performance
          initial={prefersReduceMotion ? false : { opacity: 0, y: 16 }}
          viewport={{ once: true }}
          whileInView={prefersReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ 
            // Faster animation for better mobile performance
            duration: prefersReduceMotion ? 0 : ANIMATION_DURATION,
            ease: BEZIER_CURVE,
            // Stagger after page load to prevent flash
            delay: INITIAL_DELAY
          }}
        >
          <h1 className="font-display gradient-brand-text mb-2 text-[clamp(2.6rem,7.5vw,5.3rem)] leading-[1.05] font-extrabold tracking-[-0.035em]">
            Victor&nbsp;Lenain
          </h1>

          <div className="mb-3 flex items-center gap-3 sm:justify-center">
            <span className="h-1 w-8 rounded-full bg-gradient-to-r from-[#6bb4d8] via-[#4288b7] to-[#2d5e81]" />
            <p className="text-sm font-medium tracking-wide text-indigo-200 uppercase sm:text-base">
              Développeur&nbsp;Full-Stack
            </p>
          </div>

          <p className="hidden max-w-[28ch] text-sm text-gray-300 sm:block sm:max-w-md sm:text-base">
            Conception et développement d&apos;applications web modernes, d&apos;expériences&nbsp;3D
            et d&apos;intégrations&nbsp;IA/LLM.
          </p>
        </motion.header>

        {/* Visuel 3D */}
        <motion.div
          className="order-2 h-[400px] w-full touch-pan-y lg:order-none lg:h-[500px]"
          initial={prefersReduceMotion ? false : { opacity: 0, scale: 0.93 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          viewport={{ once: true }}
          whileInView={prefersReduceMotion ? {} : { opacity: 1, scale: 1 }}
        >
          <ModelHero />
        </motion.div>
      </div>

      {/* ── Réseaux sociaux ───────────────────────────────────────── */}
      <motion.nav
        className="absolute bottom-[calc(4.5rem+env(safe-area-inset-bottom))] w-full"
        initial={prefersReduceMotion ? false : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        whileInView={prefersReduceMotion ? {} : { opacity: 1, y: 0 }}
      >
        <div className="mx-auto flex max-w-7xl justify-center gap-4 px-4 sm:gap-6 sm:px-8 lg:px-20">
          <SocialIconButton
            aria-label="GitHub"
            href="https://github.com/victornain26"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaGithub />
          </SocialIconButton>

          <SocialIconButton
            aria-label="LinkedIn"
            href="https://www.linkedin.com/in/victor-lenain-1907b7282/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaLinkedin />
          </SocialIconButton>

          <SocialIconButton
            aria-label="WhatsApp"
            href="https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaWhatsapp />
          </SocialIconButton>

          <SocialIconButton
            aria-label="Mail"
            href="mailto:victor.lenain26@gmail.com?subject=Demande%20de%20mission"
          >
            <Mail />
          </SocialIconButton>
        </div>
      </motion.nav>

      {/* ── Flèche vers la section suivante ───────────────────────── */}
      <a
        aria-label="Faire défiler vers la section À propos"
        className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-white/80 transition-opacity hover:opacity-100"
        href="#a-propos"
        onClick={e => {
          e.preventDefault();
          document.getElementById('a-propos')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <ChevronDown aria-hidden className="h-7 w-7 animate-bounce" />
      </a>
    </section>
  );
}
