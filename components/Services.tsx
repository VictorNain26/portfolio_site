'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Rocket, Bot, Database, Sparkles, Wrench, Workflow, ArrowRight } from 'lucide-react';
import Section from '@/components/Section';

const services = [
  {
    icon: Bot,
    title: 'Agents IA & assistants conversationnels',
    description:
      'Je conçois des agents qui prennent en charge des tâches concrètes : tri de mails, qualification de leads, génération de réponses, exécution d\'actions. Stack Claude Agent SDK ou LangChain selon le besoin.',
    results: ['Agents Claude / OpenAI', 'Tool use et orchestration', 'Déploiement en prod'],
  },
  {
    icon: Database,
    title: 'RAG & recherche sur documents',
    description:
      'Vos documents internes deviennent interrogeables en langage naturel. Ingestion, embeddings, recherche sémantique, réponses sourcées. pgvector pour rester sur PostgreSQL, Qdrant si volume.',
    results: ['Embeddings et chunking', 'pgvector ou Qdrant', 'Réponses citées et traçables'],
  },
  {
    icon: Workflow,
    title: 'Automatisations LLM sur mesure',
    description:
      'Plutôt que d\'empiler des outils no-code, je code des automatisations sur mesure quand le ROI est là. Génération de contenu, classification, extraction structurée, scoring. Et un script de 50 lignes si c\'est le bon outil.',
    results: ['Pipelines LLM en production', 'Suivi coûts tokens', 'Eval dès le démarrage'],
  },
  {
    icon: Rocket,
    title: 'Applications web sur mesure',
    description:
      'Sites vitrines, applications métier, plateformes SaaS. Stack Next.js / TypeScript / Node.js. Je prends le projet du prototype au déploiement, IA embarquée si elle apporte de la valeur réelle.',
    results: ['Next.js, TypeScript', 'API Node.js, PostgreSQL', 'Vercel ou Docker'],
  },
  {
    icon: Wrench,
    title: 'Refonte et interventions ponctuelles',
    description:
      'Site lent, daté ou buggé ? Je modernise, corrige, optimise. Refonte visuelle, migration technique, fix urgent, ajout de fonctionnalité. À partir d\'une demi-journée.',
    results: ['Refonte et modernisation', 'Correction de bugs', 'Optimisation performances'],
  },
  {
    icon: Sparkles,
    title: 'Conseil et audit IA',
    description:
      'Avant de coder, on regarde si l\'IA est vraiment le bon outil. Je vous aide à arbitrer entre script classique, automatisation no-code et intégration LLM, et à cadrer un prototype sérieux.',
    results: ['Cadrage prototype', 'Choix de stack et coûts', 'Audit d\'un projet existant'],
  },
];

export default function Services() {
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

  return (
    <Section className="scroll-mt-28 pb-28" id="services">
      <div className="mb-16 text-center">
        <motion.h2
          {...fadeUp(0)}
          className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
        >
          Ce que je peux faire{' '}
          <span className="hero-gradient-text">pour vous</span>
        </motion.h2>
        <motion.p
          {...fadeUp(0.1)}
          className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-400"
        >
          Je code des applications web sur mesure et j&apos;y intègre de l&apos;IA
          quand ça apporte vraiment de la valeur. Agents conversationnels, RAG sur
          vos documents, automatisations LLM, refontes et interventions ponctuelles.
          Stack Next.js, TypeScript, Claude / OpenAI, pgvector. Si un script de 50
          lignes fait le travail, je le dis avant de proposer un agent.
        </motion.p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.title}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/20 hover:bg-white/[0.04]"
              {...fadeUp(0.15 + index * 0.1)}
            >
              <div className="mb-5 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400 transition-colors group-hover:bg-indigo-500/15">
                <Icon aria-hidden="true" className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">{service.title}</h3>
              <p className="mb-5 text-sm leading-relaxed text-gray-400">{service.description}</p>
              <ul className="mb-5 space-y-2">
                {service.results.map((result) => (
                  <li
                    key={result}
                    className="flex items-center gap-2.5 text-sm text-indigo-300"
                  >
                    <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                    {result}
                  </li>
                ))}
              </ul>
              <a
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-indigo-400"
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Discuter de votre projet
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
