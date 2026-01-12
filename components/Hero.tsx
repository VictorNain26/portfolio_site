'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Mail, ArrowRight } from 'lucide-react';
import { FaWhatsapp, FaGithub, FaLinkedin } from 'react-icons/fa';
import { SocialIconButton } from '@/components/ui/social-icon-button';

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const fadeIn = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
      };

  return (
    <section
      className="relative flex min-h-[100svh] flex-col items-center justify-between px-4 py-20 sm:px-8 sm:py-24"
      id="accueil"
    >
      {/* Spacer top pour centrer le contenu */}
      <div className="flex-1" />

      {/* Contenu principal centré */}
      <div className="mx-auto w-full max-w-3xl text-center">
        {/* Badge intro */}
        <motion.div
          {...fadeIn}
          className="mb-6"
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Disponible pour des missions
          </span>
        </motion.div>

        {/* Nom */}
        <motion.h1
          {...fadeIn}
          className="font-display gradient-brand-text mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl"
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Victor Lenain
        </motion.h1>

        {/* Titre */}
        <motion.p
          {...fadeIn}
          className="mb-5 text-lg font-medium text-indigo-200 sm:mb-6 sm:text-2xl"
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Développeur Full-Stack JavaScript
        </motion.p>

        {/* Description courte */}
        <motion.p
          {...fadeIn}
          className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-gray-400 sm:mb-8 sm:text-lg"
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Je transforme vos idées en{' '}
          <span className="text-indigo-300">applications web performantes</span>.
          Sites sur mesure, automatisation et{' '}
          <span className="text-indigo-300">intégration IA</span>.
        </motion.p>

        {/* Tech badges */}
        <motion.div
          {...fadeIn}
          className="mb-8 flex flex-wrap items-center justify-center gap-2 text-xs sm:gap-3 sm:text-sm"
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1">
            <span className="font-semibold text-white">React</span> / <span className="font-semibold text-white">Next.js</span>
          </span>
          <span className="rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1">
            <span className="font-semibold text-white">Node.js</span> / <span className="font-semibold text-white">TypeScript</span>
          </span>
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1">
            Ex <span className="font-semibold text-indigo-300">Capsens</span>
          </span>
        </motion.div>

        {/* CTA */}
        <motion.div
          {...fadeIn}
          className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a
            className="group inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl sm:px-8 sm:py-4"
            href="mailto:victor.lenain26@gmail.com?subject=Demande%20de%20mission"
          >
            <Mail aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
            Discutons de votre projet
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800/50 px-5 py-3 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-gray-600 hover:bg-gray-800 hover:text-white sm:px-6 sm:py-4"
            href="https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaWhatsapp aria-hidden="true" className="h-4 w-4 text-green-400 sm:h-5 sm:w-5" />
            WhatsApp
          </a>
        </motion.div>
      </div>

      {/* Spacer bottom + éléments de navigation */}
      <div className="flex flex-1 flex-col items-center justify-end gap-6 pt-8">
        {/* Réseaux sociaux */}
        <motion.nav
          {...fadeIn}
          className="flex justify-center gap-3"
          transition={{ duration: 0.5, delay: 0.7 }}
        >
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
        </motion.nav>

        {/* Flèche scroll - dans le flux, plus de chevauchement */}
        <motion.a
          {...fadeIn}
          aria-label="Voir mes services"
          className="text-gray-500 transition-colors hover:text-white"
          href="#services"
          transition={{ duration: 0.5, delay: 0.8 }}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </motion.a>
      </div>
    </section>
  );
}
