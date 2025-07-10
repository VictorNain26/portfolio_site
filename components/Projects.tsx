'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Github } from 'lucide-react';
import Section from '@/components/Section';
import ProjectCard from '@/components/ProjectCard';
import { useGitHubProjects } from '@/hooks/useGitHubProjects';

export default function Projects() {
  const { projects, loading, error, refetch } = useGitHubProjects();

  return (
    <Section id="projets" className="scroll-mt-28 pb-28">
      {/* Header */}
      <div className="mb-12 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 font-display text-3xl font-bold text-indigo-400"
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
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md"
        >
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-400 mb-3" />
            <h3 className="text-lg font-semibold text-red-400 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-red-300/80 text-sm mb-4">
              {error}
            </p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </button>
          </div>
        </motion.div>
      )}

      {/* Projets */}
      {!loading && !error && (
        <>
          {projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index} 
                />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-md text-center"
            >
              <div className="rounded-lg border border-gray-700/50 bg-gray-800/60 p-8">
                <Github className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  Aucun projet trouvé
                </h3>
                <p className="text-gray-400 text-sm">
                  Aucun projet disponible pour le moment.
                </p>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Footer avec lien GitHub */}
      {!loading && !error && projects.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/victornain26"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <Github className="h-5 w-5" />
            Voir tous mes projets sur GitHub
          </a>
        </motion.div>
      )}
    </Section>
  );
}
