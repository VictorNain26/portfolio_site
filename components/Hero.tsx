'use client';

import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, GithubIcon, Linkedin, Mail } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { SocialIconButton } from '@/components/ui/social-icon-button';

const ModelHero = dynamic(() => import('@/components/ModelHero'), {
  ssr: false,
});

export default function Hero() {
  const prefersReduceMotion = useReducedMotion();

  return (
    <section
      id="accueil"
      className="relative flex min-h-[100svh] flex-col items-center overflow-hidden pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-0"
    >
      {/* ── Contenu principal ─────────────────────────────────────── */}
      <div className="mx-auto flex max-w-7xl flex-col gap-14 px-0 sm:items-center sm:gap-10 sm:px-8 lg:grid lg:min-h-[70vh] lg:grid-cols-2 lg:place-items-center lg:gap-16 lg:px-20">
        {/* Titre + tagline */}
        <motion.header
          initial={prefersReduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={prefersReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="order-1 flex flex-col sm:items-center lg:order-none lg:items-start"
        >
          <h1 className="mb-2 font-display text-[clamp(2.6rem,7.5vw,5.3rem)] font-extrabold leading-[1.05] tracking-[-0.035em] gradient-brand-text">
            Victor&nbsp;Lenain
          </h1>

          <div className="mb-3 flex items-center gap-3 sm:justify-center">
            <span className="h-1 w-8 rounded-full bg-gradient-to-r from-[#6bb4d8] via-[#4288b7] to-[#2d5e81]" />
            <p className="text-sm font-medium uppercase tracking-wide text-indigo-200 sm:text-base">
              Développeur&nbsp;Full-Stack
            </p>
          </div>

          <p className="hidden max-w-[28ch] text-sm text-gray-300 sm:block sm:max-w-md sm:text-base">
            Conception et développement d&apos;applications web modernes,
            d&apos;expériences&nbsp;3D et de solutions&nbsp;IA.
          </p>
        </motion.header>

        {/* Visuel 3D */}
        <motion.div
          initial={prefersReduceMotion ? false : { opacity: 0, scale: 0.93 }}
          whileInView={prefersReduceMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="order-2 w-full h-[400px] lg:order-none lg:h-[500px] touch-pan-y"
        >
          <ModelHero />
        </motion.div>
      </div>

      {/* ── Réseaux sociaux ───────────────────────────────────────── */}
      <motion.nav
        initial={prefersReduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={prefersReduceMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-[calc(4.5rem+env(safe-area-inset-bottom))] w-full"
      >
        <div className="mx-auto flex max-w-7xl justify-center gap-4 px-4 sm:gap-6 sm:px-8 lg:px-20">
          <SocialIconButton
            href="https://github.com/victornain26"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon />
          </SocialIconButton>

          <SocialIconButton
            href="https://www.linkedin.com/in/victor-lenain-1907b7282/"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin />
          </SocialIconButton>

          <SocialIconButton 
            href="https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous" 
            aria-label="WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
          </SocialIconButton>

          <SocialIconButton
            href="mailto:victor.lenain26@gmail.com?subject=Demande%20de%20mission"
            aria-label="Mail"
          >
            <Mail />
          </SocialIconButton>
        </div>
      </motion.nav>

      {/* ── Flèche vers la section suivante ───────────────────────── */}
      <a
        href="#a-propos"
        aria-label="Faire défiler vers la section À propos"
        className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-white/80 transition-opacity hover:opacity-100"
        onClick={e => {
          e.preventDefault();
          document
            .getElementById('a-propos')
            ?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <ChevronDown className="h-7 w-7 animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
