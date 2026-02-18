'use client';

import { motion } from 'framer-motion';
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
  return (
    <Section className="scroll-mt-28 pb-28" id="projets">
      <div className="mb-12 text-center">
        <motion.h2
          className="font-display mb-4 text-3xl font-bold text-indigo-400"
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Mes Projets
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
