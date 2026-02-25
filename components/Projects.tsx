'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Section from '@/components/Section';
import ProjectCard from '@/components/ProjectCard';
import { type Project } from '@/lib/github';

type FeaturedProject = Project & {
  ctaLabel: string;
};

const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 1,
    name: 'AubeSonore',
    description:
      'Web radio indépendante avec découverte musicale automatisée. Pipeline intelligent : découverte via HypeMachine, téléchargement, analyse audio par IA et diffusion en continu sur AzuraCast.',
    demoUrl: 'https://www.aubesonore.fr/',
    repoUrl: null,
    technologies: ['TypeScript', 'Python', 'Next.js', 'Docker'],
    stars: 0,
    updatedAt: '2026-02-01T00:00:00Z',
    createdAt: '2025-06-01T00:00:00Z',
    ctaLabel: 'Écouter la radio',
  },
  {
    id: 2,
    name: 'TomIA',
    description:
      'Plateforme de tutorat IA pour les élèves français. Programmes officiels Éduscol intégrés via RAG avec Qdrant et embeddings Mistral pour un accompagnement scolaire personnalisé.',
    demoUrl: 'https://www.tomia.fr/',
    repoUrl: null,
    technologies: ['TypeScript', 'Python', 'Qdrant', 'Mistral'],
    stars: 0,
    updatedAt: '2026-02-01T00:00:00Z',
    createdAt: '2025-09-01T00:00:00Z',
    ctaLabel: 'Voir le site',
  },
];

export default function Projects() {
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
    <Section className="scroll-mt-28 pb-28" id="projets">
      <div className="mb-16 text-center">
        <motion.h2
          {...fadeUp(0)}
          className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
        >
          Mes{' '}
          <span className="hero-gradient-text">Projets</span>
        </motion.h2>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        {FEATURED_PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.id}
            ctaLabel={project.ctaLabel}
            index={index}
            project={project}
          />
        ))}
      </div>
    </Section>
  );
}
