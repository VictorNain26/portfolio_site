'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Section from '@/components/Section';
import FadeOnView from '@/components/FadeOnView';
import { cn } from '@/lib/utils';

const faqItems = [
  {
    question: 'Quel est votre tarif journalier (TJM) ?',
    answer:
      'Mon TJM démarre à 500 € selon la complexité du projet, la durée de la mission et la stack. Devis détaillé proposé après notre premier échange.',
  },
  {
    question: 'Êtes-vous disponible pour une mission ?',
    answer:
      'Je réponds sous 24 h ouvrées. Démarrage possible sous 1 à 2 semaines selon le planning en cours.',
  },
  {
    question: 'Travaillez-vous en remote ?',
    answer:
      'Oui, principalement en remote. Je suis basé en région parisienne et je me déplace ponctuellement pour les réunions de lancement ou les ateliers importants.',
  },
  {
    question: "Qu'avez-vous déjà livré côté IA ?",
    answer:
      "Deux produits IA livrés en solo : AubeSonore en production depuis 2025 (pipeline audio quotidien), TomIA en pré-prod pour 2026 (RAG sur programmes Éduscol, eval continue). Les briques que je propose en mission — serveur MCP, démo RAG, pipeline d'eval — sont publiées en open-source, lisibles avant signature. 4 ans de Rails en prod chez Capsens (fintech, 2022-2024) sur le code applicatif derrière.",
  },
  {
    question: 'Combien de temps dure un projet type ?',
    answer:
      "Un site vitrine prend 2 à 4 semaines. Une application métier, 1 à 3 mois selon le périmètre. Je privilégie les livraisons itératives pour que vous ayez de la visibilité rapidement.",
  },
  {
    question: 'Faites-vous des interventions courtes (correction de bug, refonte, ajout de fonctionnalité) ?',
    answer:
      "Oui : bug urgent, refonte ciblée, ajout de fonctionnalité, optimisation de perf, audit de stack. Intervention à partir d'une demi-journée, devis fixe sur les périmètres bornés.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section className="scroll-mt-28" id="faq">
      <FadeOnView className="mb-14 max-w-2xl">
        <p className="font-display mb-3 text-sm font-medium uppercase tracking-[0.18em] text-indigo-400">
          Questions fréquentes
        </p>
        <h2 className="font-display text-3xl font-bold leading-[1.1] text-white sm:text-4xl lg:text-5xl">
          Les réponses aux questions que vous vous posez probablement.
        </h2>
      </FadeOnView>

      <div className="mx-auto max-w-3xl space-y-3">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <FadeOnView
              key={item.question}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-colors hover:border-indigo-500/20"
              delay={0.05 + index * 0.04}
            >
              <button
                aria-controls={`faq-answer-${index.toString()}`}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                id={`faq-btn-${index.toString()}`}
                type="button"
                onClick={() => {
                  toggle(index);
                }}
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
              <div
                aria-labelledby={`faq-btn-${index.toString()}`}
                className="grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none"
                id={`faq-answer-${index.toString()}`}
                role="region"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-4 text-sm leading-relaxed text-gray-400">
                    {item.answer}
                  </p>
                </div>
              </div>
            </FadeOnView>
          );
        })}
      </div>
    </Section>
  );
}
