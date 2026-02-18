// components/ProjectCard.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { type Project, getTechnologyColor } from '@/lib/github';

const ANIMATION_DELAY_MULTIPLIER = 0.15;

type ProjectCardProps = {
  project: Project;
  index: number;
  ctaLabel?: string;
};

export default function ProjectCard({
  project,
  index,
  ctaLabel = 'Voir le site',
}: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="group relative"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      transition={{ delay: index * ANIMATION_DELAY_MULTIPLIER, duration: 0.6 }}
      viewport={{ once: true }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
    >
      <div className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-gray-900/80 hover:shadow-xl hover:shadow-indigo-500/10">
        {/* Header avec gradient */}
        <div className="relative h-40 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />

          {/* Badge projet personnel */}
          <div className="absolute top-4 left-4">
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300 backdrop-blur-sm">
              Projet personnel
            </span>
          </div>

          {/* Titre du projet */}
          <div className="absolute right-4 bottom-4 left-4">
            <h3 className="text-2xl font-bold text-white">
              {project.name}
            </h3>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex flex-1 flex-col p-6">
          {/* Description */}
          <p className="mb-6 text-sm leading-relaxed text-gray-300">
            {project.description}
          </p>

          {/* Technologies */}
          {project.technologies.length > 0 && (
            <div className="mb-6">
              <h4 className="mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase">
                Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium text-white bg-[--tech-color]/20 border-[--tech-color]/40"
                    style={
                      { '--tech-color': getTechnologyColor(tech) } as React.CSSProperties
                    }
                  >
                    <span className="h-2 w-2 rounded-full bg-[--tech-color]" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto flex items-center gap-3">
            {project.demoUrl !== null && project.demoUrl !== '' && (
              <a
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
                href={project.demoUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLink className="h-4 w-4" />
                {ctaLabel}
              </a>
            )}
          </div>
        </div>

        {/* Effet de survol */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </motion.div>
  );
}
