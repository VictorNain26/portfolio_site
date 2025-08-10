'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Section from '@/components/Section';
import ProjectCard from '@/components/ProjectCard';
import { useGitHubProjects } from '@/hooks/useGitHubProjects';

export default function Projects() {
  const { projects, loading, error, refetch } = useGitHubProjects();

  return (
    <Section className="scroll-mt-28 pb-28" id="projets">
      {/* Header */}
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

      {/* État de chargement */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-400">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Récupération des projets GitHub...</span>
          </div>
        </div>
      )}

      {/* État d'erreur */}
      {error !== null && error !== '' && (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
        >
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-6 text-center">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
            <h3 className="mb-2 text-lg font-semibold text-red-400">Erreur de chargement</h3>
            <p className="mb-4 text-sm text-red-300/80">{error}</p>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              onClick={() => {
                void refetch();
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </button>
          </div>
        </motion.div>
      )}

      {/* Projets */}
      {!loading && error === null && projects.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} index={index} project={project} />
          ))}
        </div>
      )}

      {!loading && error === null && projects.length === 0 && (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md text-center"
          initial={{ opacity: 0, scale: 0.95 }}
        >
          <div className="rounded-lg border border-gray-700/50 bg-gray-800/60 p-8">
            <FaGithub className="mx-auto mb-4 h-12 w-12 text-gray-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-300">Aucun projet trouvé</h3>
            <p className="text-sm text-gray-400">Aucun projet disponible pour le moment.</p>
          </div>
        </motion.div>
      )}

      {/* Footer avec lien GitHub */}
      {!loading && error === null && projects.length > 0 && (
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <a
            className="inline-flex items-center gap-2 text-indigo-400 transition-colors hover:text-indigo-300"
            href="https://github.com/victornain26"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaGithub className="h-5 w-5" />
            Voir tous mes projets sur GitHub
          </a>
        </motion.div>
      )}
    </Section>
  );
}
