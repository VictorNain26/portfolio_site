'use client';

import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Briefcase, Layers, Clock, Headphones } from 'lucide-react';
import Section from '@/components/Section';

const COUNTER_DURATION = 2000;

const figures = [
  {
    icon: Briefcase,
    value: 2,
    suffix: ' ans',
    label: 'en agence web',
    description: 'Sur des projets réels, avec de vrais clients et de vraies contraintes',
  },
  {
    icon: Layers,
    value: 10,
    suffix: '+',
    label: 'projets livrés',
    description: 'Applications métier, sites vitrines, outils internes et plateformes SaaS',
  },
  {
    icon: Clock,
    value: 48,
    suffix: 'h',
    label: 'pour une réponse',
    description: 'Disponibilité et réactivité, dès le premier message',
  },
  {
    icon: Headphones,
    value: 30,
    suffix: ' jours',
    label: 'de suivi post-livraison',
    description: 'Corrections, ajustements et accompagnement inclus après la mise en ligne',
  },
];

function AnimatedCounter({ value, suffix, inView, reduced }: {
  value: number;
  suffix: string;
  inView: boolean;
  reduced: boolean | null;
}) {
  const shouldAnimate = inView && !reduced;
  const [count, setCount] = useState(reduced ? value : 0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!shouldAnimate || hasAnimated.current) return;
    hasAnimated.current = true;

    let current = 0;
    const steps = 30;
    const increment = value / steps;
    const stepDuration = COUNTER_DURATION / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [shouldAnimate, value]);

  return (
    <span className="font-display text-4xl font-bold text-indigo-400">
      {count}{suffix}
    </span>
  );
}

export default function KeyFigures() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section className="scroll-mt-28" id="chiffres">
      <div className="mb-12 text-center">
        <h2 className="font-display mb-4 text-3xl font-bold text-indigo-400">
          En quelques chiffres
        </h2>
      </div>

      <div ref={ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {figures.map((figure, index) => {
          const Icon = figure.icon;
          return (
            <motion.div
              key={figure.label}
              className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 text-center transition-colors hover:border-indigo-500/30 hover:bg-gray-900/80"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            >
              <div className="mb-3 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                <Icon aria-hidden="true" className="h-6 w-6" />
              </div>
              <div className="mb-1">
                <AnimatedCounter
                  inView={inView}
                  reduced={prefersReducedMotion}
                  suffix={figure.suffix}
                  value={figure.value}
                />
              </div>
              <p className="mb-1 text-sm font-semibold text-white">{figure.label}</p>
              <p className="text-xs leading-relaxed text-gray-400">{figure.description}</p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
