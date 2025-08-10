'use client';
import { motion } from 'framer-motion';
import Section from '@/components/Section';

export default function Services() {
  const services = [
    {
      title: 'Développement front-end',
      desc: 'Interfaces utilisateur modernes, réactives et accessibles pour une expérience optimale.',
    },
    {
      title: 'Backend & DevOps',
      desc: 'APIs robustes, architectures scalables et déploiements automatisés.',
    },
    {
      // L’IA évolue rapidement et inclut désormais les grands modèles de langage.
      // Ce service met l’accent sur l’intégration d’IA et de LLM (Large Language Models)
      // pour automatiser, personnaliser et enrichir vos applications web avec des
      // fonctionnalités conversationnelles, de génération et d’analyse de données.
      title: 'IA & LLM',
      desc: 'Intégration de solutions d’IA et de modèles de langage (LLM) pour automatiser, personnaliser et enrichir vos applications.',
    },
  ];

  return (
    <Section className="scroll-mt-28 pb-28" id="services">
      <h2 className="font-display mb-10 text-3xl font-bold text-indigo-400">Services</h2>

      <div className="grid gap-6 md:grid-cols-3">
        {services.map(s => (
          <motion.div
            key={s.title}
            className="rounded-3xl border border-gray-700/50 bg-gray-900/60 p-6 shadow-lg"
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            whileHover={{ rotateX: -4, rotateY: 6, y: -4 }}
          >
            <h3 className="font-semibold text-indigo-300">{s.title}</h3>
            <p className="mt-2 text-gray-300">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
