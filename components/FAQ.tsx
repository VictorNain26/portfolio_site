'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Section from '@/components/Section';
import { cn } from '@/lib/utils';

const faqItems = [
  {
    question: 'Quel est votre tarif journalier (TJM) ?',
    answer:
      'Mon TJM démarre à 500\u00a0€ selon la complexité du projet, la durée de la mission et les technologies impliquées. Je propose toujours un devis détaillé après notre premier échange.',
  },
  {
    question: 'Êtes-vous disponible pour une mission ?',
    answer:
      'Je réponds sous 24\u00a0h et le démarrage peut être très rapide — parfois quelques jours seulement, selon ma disponibilité du moment. Contactez-moi pour en discuter.',
  },
  {
    question: 'Travaillez-vous en remote ?',
    answer:
      'Oui, je travaille principalement en remote. Je suis basé en région parisienne et peux me déplacer ponctuellement pour des réunions, ateliers ou phases de lancement.',
  },
  {
    question: 'Combien de temps dure un projet type ?',
    answer:
      'Un site vitrine prend 2 à 4 semaines. Une application métier, 1 à 3 mois selon le périmètre. Je privilégie les livraisons itératives pour que vous ayez de la visibilité rapidement.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 } as const,
          whileInView: { opacity: 1, y: 0 } as const,
          viewport: { once: true } as const,
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section className="scroll-mt-28" id="faq">
      <div className="mb-16 text-center">
        <motion.h2
          {...fadeUp(0)}
          className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
        >
          Questions{' '}
          <span className="hero-gradient-text">fréquentes</span>
        </motion.h2>
        <motion.p
          {...fadeUp(0.1)}
          className="mx-auto mt-4 max-w-2xl text-lg text-gray-400"
        >
          Les réponses aux questions que vous vous posez probablement
        </motion.p>
      </div>

      <div className="mx-auto max-w-3xl space-y-3">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={item.question}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-colors hover:border-indigo-500/20"
              {...fadeUp(0.15 + index * 0.05)}
            >
              <button
                aria-controls={`faq-answer-${index}`}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                id={`faq-btn-${index}`}
                onClick={() => toggle(index)}
              >
                <h3 className="pr-4 text-sm font-semibold text-white sm:text-base">
                  {item.question}
                </h3>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    'h-5 w-5 shrink-0 text-indigo-400 transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    animate={{ height: 'auto', opacity: 1 }}
                    aria-labelledby={`faq-btn-${index}`}
                    exit={{ height: 0, opacity: 0 }}
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    role="region"
                    style={{ overflow: 'hidden' }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { duration: 0.25, ease: 'easeInOut' }
                    }
                  >
                    <p className="px-6 pb-4 text-sm leading-relaxed text-gray-400">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
