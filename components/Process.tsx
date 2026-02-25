'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { MessageCircle, FileText, Code, Rocket } from 'lucide-react';
import Section from '@/components/Section';

const steps = [
  {
    icon: MessageCircle,
    number: '01',
    title: 'Échange gratuit',
    description:
      'On discute de votre projet, vos objectifs et vos contraintes. Je vous donne un premier avis honnête — sans engagement.',
  },
  {
    icon: FileText,
    number: '02',
    title: 'Proposition claire',
    description:
      'Vous recevez un devis détaillé avec périmètre, délais et budget. Pas de surprise, pas de jargon.',
  },
  {
    icon: Code,
    number: '03',
    title: 'Développement itératif',
    description:
      'Je développe par étapes avec des points réguliers. Vous voyez l\'avancement et pouvez ajuster en cours de route.',
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Livraison + suivi',
    description:
      'Mise en ligne, formation à l\'outil, et suivi après livraison. Le projet ne s\'arrête pas à la dernière ligne de code.',
  },
];

export default function Process() {
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
    <Section className="scroll-mt-28" id="process">
      <div className="mb-16 text-center">
        <motion.h2
          {...fadeUp(0)}
          className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
        >
          Comment je{' '}
          <span className="hero-gradient-text">travaille</span>
        </motion.h2>
        <motion.p
          {...fadeUp(0.1)}
          className="mx-auto mt-4 max-w-2xl text-lg text-gray-400"
        >
          Un process simple et transparent, du premier échange à la mise en ligne
        </motion.p>
      </div>

      <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Connecting line (desktop) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-14 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent lg:block"
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/20 hover:bg-white/[0.04]"
              {...fadeUp(0.15 + index * 0.1)}
            >
              <span className="font-display mb-4 block text-3xl font-bold text-indigo-500/20">
                {step.number}
              </span>
              <div className="mb-4 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400 transition-colors group-hover:bg-indigo-500/15">
                <Icon aria-hidden="true" className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{step.description}</p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
