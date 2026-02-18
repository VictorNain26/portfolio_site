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
      'Je réponds sous 48\u00a0h et le démarrage peut être très rapide — parfois quelques jours seulement, selon ma disponibilité du moment. Contactez-moi pour en discuter.',
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
  const prefersReducedMotion = useReducedMotion();

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section className="scroll-mt-28" id="faq">
        <div className="mb-12 text-center">
          <h2 className="font-display mb-4 text-3xl font-bold text-indigo-400">
            Questions fréquentes
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Les réponses aux questions que vous vous posez probablement
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="rounded-xl border border-gray-800 bg-gray-900/50 transition-colors hover:border-indigo-500/30"
              >
                <button
                  aria-controls={`faq-answer-${index}`}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                  id={`faq-btn-${index}`}
                  onClick={() => toggle(index)}
                >
                  <span className="pr-4 text-sm font-semibold text-white sm:text-base">
                    {item.question}
                  </span>
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
                        prefersReducedMotion
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
              </div>
            );
          })}
        </div>
      </Section>
  );
}
