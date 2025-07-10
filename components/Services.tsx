'use client';
import { motion } from 'framer-motion';
import Section from '@/components/Section';

export default function Services() {
  const services = [
    {
      title: 'Développement front-end',
      desc: 'UIs réactives, accessibles et performantes.',
    },
    {
      title: 'Backend & DevOps',
      desc: 'APIs Node.js, bases SQL/NoSQL, Docker, CI/CD.',
    },
    {
      title: 'Fonctionnalités IA',
      desc: 'Chatbots, recherche sémantique, génération de contenu.',
    },
  ];

  return (
    <Section id="services" className="scroll-mt-28 pb-28">
      <h2 className="mb-10 font-display text-3xl font-bold text-indigo-400">
        Services
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {services.map(s => (
          <motion.div
            key={s.title}
            whileHover={{ rotateX: -4, rotateY: 6, y: -4 }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            className="rounded-3xl border border-gray-700/50 bg-gray-900/60 p-6 shadow-lg"
          >
            <h3 className="font-semibold text-indigo-300">{s.title}</h3>
            <p className="mt-2 text-gray-300">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
