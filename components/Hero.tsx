'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';

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
      className="flex min-h-[100svh] flex-col items-center justify-center px-4 sm:px-8"
      id="accueil"
    >
      <div className="mx-auto max-w-2xl text-center">
        {/* Badge disponibilité */}
        <motion.div
          {...fadeIn}
          className="mb-8"
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Disponible pour une mission
          </span>
        </motion.div>

        {/* Nom */}
        <motion.h1
          {...fadeIn}
          className="font-display mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Victor Lenain
        </motion.h1>

        {/* Titre + Crédibilité */}
        <motion.p
          {...fadeIn}
          className="mb-6 text-lg text-gray-400 sm:text-xl"
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Développeur Full-Stack JavaScript{' '}
          <span className="text-indigo-400">· Ex Capsens</span>
        </motion.p>

        {/* Proposition de valeur - une seule phrase */}
        <motion.p
          {...fadeIn}
          className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-gray-300 sm:text-lg"
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Je crée des applications web performantes avec React, Next.js et Node.js.
        </motion.p>

        {/* CTA unique et fort */}
        <motion.div
          {...fadeIn}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a
            className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
            href="mailto:victor.lenain26@gmail.com?subject=Demande%20de%20mission"
          >
            <Mail aria-hidden="true" className="h-5 w-5" />
            Discuter de votre projet
            <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Lien secondaire discret */}
        <motion.p
          {...fadeIn}
          className="mt-6 text-sm text-gray-500"
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          ou via{' '}
          <a
            className="text-green-400 underline underline-offset-4 transition-colors hover:text-green-300"
            href="https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous"
            rel="noopener noreferrer"
            target="_blank"
          >
            WhatsApp
          </a>
        </motion.p>
      </div>
    </section>
  );
}
