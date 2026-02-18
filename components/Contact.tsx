'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Mail, MessageCircle, Calendar, ArrowRight } from 'lucide-react';
import Section from '@/components/Section';
import CalPopupButton from '@/components/CalPopupButton';

export default function Contact() {
  const reduced = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 } as const,
          whileInView: { opacity: 1, y: 0 } as const,
          viewport: { once: true } as const,
          transition: { duration: 0.5, delay },
        };

  return (
    <Section className="scroll-mt-28 pb-32" id="contact">
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-gray-800/60 bg-gray-900/40 px-6 py-16 text-center backdrop-blur-sm sm:px-12">
        {/* Glow background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-indigo-600/[0.08] blur-[100px]"
        />

        {/* Gradient top border accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"
        />

        {/* Content */}
        <div className="relative">
          <motion.h2
            {...fadeUp(0.1)}
            className="font-display mb-4 text-3xl font-bold text-white"
          >
            Parlons de votre projet
          </motion.h2>

          <motion.p
            {...fadeUp(0.2)}
            className="mx-auto mb-10 max-w-md text-gray-400"
          >
            Premier échange gratuit et sans engagement.
            On regarde ensemble si je peux vous aider.
          </motion.p>

          {/* CTA principal */}
          <motion.div {...fadeUp(0.3)}>
            <CalPopupButton
              className="group inline-flex items-center gap-3 rounded-full bg-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/30 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              data-umami-event="cta-contact-cal"
            >
              <Calendar aria-hidden className="h-5 w-5" />
              Réserver un call de 15&nbsp;min
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              />
            </CalPopupButton>
          </motion.div>

          {/* CTAs secondaires */}
          <motion.div
            {...fadeUp(0.4)}
            className="mt-6 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              className="inline-flex items-center gap-2 rounded-full border border-gray-700/50 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-gray-400 backdrop-blur-sm transition-colors hover:border-gray-600 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              data-umami-event="cta-contact-email"
              href="mailto:victor.lenain26@gmail.com?subject=Demande%20de%20mission"
            >
              <Mail aria-hidden className="h-4 w-4" />
              Par email
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-gray-700/50 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-gray-400 backdrop-blur-sm transition-colors hover:border-gray-600 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
              data-umami-event="cta-contact-whatsapp"
              href="https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous"
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden className="h-4 w-4" />
              WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
