'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Rocket, Cog, Sparkles } from 'lucide-react';
import Section from '@/components/Section';

const STAGGER_DELAY = 0.1;

const services = [
  {
    icon: Rocket,
    title: 'Applications web sur mesure',
    description:
      'Des interfaces modernes, rapides et accessibles qui convertissent vos visiteurs en clients. Sites vitrines, applications métier, plateformes e-commerce.',
    results: ['Sites rapides et bien référencés', 'Interfaces intuitives', 'Mobile-first'],
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
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section className="scroll-mt-28 pb-28" id="services">
      <div className="mb-12 text-center">
        <h2 className="font-display mb-4 text-3xl font-bold text-indigo-400">
          Ce que je peux faire pour vous
        </h2>
        <p className="mx-auto max-w-2xl text-gray-400">
          Des solutions concrètes pour développer votre activité en ligne
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.title}
              className="group rounded-2xl border border-gray-800 bg-gray-900/50 p-6 transition-colors hover:border-indigo-500/30 hover:bg-gray-900/80"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              transition={{ delay: index * STAGGER_DELAY, duration: 0.4 }}
              viewport={{ once: true }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            >
              <div className="mb-4 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                <Icon aria-hidden="true" className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{service.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-400">{service.description}</p>
              <ul className="space-y-1">
                {service.results.map((result) => (
                  <li
                    key={result}
                    className="flex items-center gap-2 text-sm text-indigo-300"
                  >
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-indigo-400" />
                    {result}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
