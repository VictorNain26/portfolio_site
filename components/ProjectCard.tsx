// components/ProjectCard.tsx
'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Star, Calendar } from 'lucide-react';
import { type Project, getTechnologyColor } from '@/lib/github';

type ProjectCardProps = {
  project: Project;
  index: number;
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative"
    >
      <div className="relative flex h-96 flex-col overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-gray-600/70 hover:bg-gray-800/80 hover:shadow-xl hover:shadow-indigo-500/10">
        {/* Header avec gradient */}
        <div className="relative h-32 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />

          {/* Badges en haut à droite */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {project.stars > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-gray-900/60 px-2 py-1 text-xs text-yellow-400 backdrop-blur-sm">
                <Star className="h-3 w-3 fill-current" />
                {project.stars}
              </div>
            )}
            <div className="flex items-center gap-1 rounded-full bg-gray-900/60 px-2 py-1 text-xs text-gray-300 backdrop-blur-sm">
              <Calendar className="h-3 w-3" />
              {formatDate(project.updatedAt)}
            </div>
          </div>

          {/* Titre du projet */}
          <div className="absolute right-4 bottom-4 left-4">
            <h3 className="mb-1 text-xl font-bold text-white capitalize">
              {project.name.replace(/-/g, ' ')}
            </h3>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex flex-1 flex-col p-6">
          {/* Description */}
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-300">
            {project.description}
          </p>

          {/* Technologies */}
          {project.technologies.length > 0 && (
            <div className="mb-6 flex-1">
              <h4 className="mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase">
                Langages
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 4).map(tech => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white"
                    style={{
                      backgroundColor: `${getTechnologyColor(tech)}20`,
                      borderColor: getTechnologyColor(tech),
                      border: `1px solid ${getTechnologyColor(tech)}40`,
                    }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: getTechnologyColor(tech) }}
                    />
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="inline-flex items-center rounded-full bg-gray-700/50 px-2.5 py-1 text-xs font-medium text-gray-400">
                    +{project.technologies.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
              >
                <ExternalLink className="h-4 w-4" />
                Voir la démo
              </a>
            )}

            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
            >
              <Github className="h-4 w-4" />
              Code source
            </a>
          </div>
        </div>

        {/* Effet de survol */}
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </motion.div>
  );
}
