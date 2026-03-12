'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Rocket, Cog, Sparkles, Wrench, ArrowRight } from 'lucide-react';
import Section from '@/components/Section';

const services = [
  {
    icon: Rocket,
    title: 'Création d\'applications web',
    description:
      'Des interfaces modernes, rapides et accessibles qui convertissent vos visiteurs en clients. Sites vitrines, applications métier, plateformes e-commerce.',
    results: ['Sites rapides et bien référencés', 'Interfaces intuitives', 'Mobile-first'],
  },
  {
    icon: Wrench,
    title: 'Refonte & interventions ponctuelles',
    description:
      'Votre site est lent, daté ou buggé ? Je modernise, corrige et optimise l\'existant. Refonte visuelle, migration technique, fix urgent ou ajout de fonctionnalité.',
    results: ['Refonte et modernisation', 'Correction de bugs', 'Optimisation performances'],
  },
  {
    icon: Cog,
    title: 'Backend & DevOps',
    description:
      'Des APIs fiables, une infrastructure solide et un déploiement automatisé. CI/CD, Docker, base de données, authentification, intégrations tierces.',
    results: ['APIs performantes', 'CI/CD & Docker', 'Architecture évolutive'],
  },
  {
    icon: Sparkles,
    title: 'Intégration IA & automatisation',
    description:
      'Gagnez du temps en automatisant vos tâches répétitives. Chatbots, génération de contenu, analyse de données, assistants intelligents.',
    results: ['Automatisation des process', 'Chatbots sur mesure', 'Gain de productivité'],
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
          className="mx-auto mt-4 max-w-2xl text-lg text-gray-400"
        >
          Des solutions concrètes pour développer votre activité en ligne
        </motion.p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
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
