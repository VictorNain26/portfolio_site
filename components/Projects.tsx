import { ExternalLink, ArrowUpRight } from 'lucide-react';
import Section from '@/components/Section';
import FadeOnView from '@/components/FadeOnView';

type FeaturedProject = {
  name: string;
  tagline: string;
  context: string;
  what: string;
  stack: string[];
  url: string;
  ctaLabel: string;
  status: 'live' | 'development';
  accent: 'indigo' | 'rose';
};

const projects: [FeaturedProject, FeaturedProject] = [
  {
    name: 'AubeSonore',
    tagline: 'Web radio indépendante, pilotée par un pipeline IA',
    context:
      "Faire tourner une web radio 24/7 sans équipe édito : trouver chaque jour des morceaux nouveaux, les qualifier, les programmer.",
    what:
      "Pipeline d'ingestion audio quotidien : scraping de sources musicales, analyse par modèles audio (BPM, énergie, genre), curation automatique et diffusion en flux sur AzuraCast. Versionné, observable, redémarrable.",
    stack: ['TypeScript', 'Python', 'Next.js', 'Docker'],
    url: 'https://www.aubesonore.fr/',
    ctaLabel: 'Écouter la radio',
    status: 'live',
    accent: 'indigo',
  },
  {
    name: 'TomIA',
    tagline: 'Tuteur IA aligné sur les programmes Éduscol',
    context:
      "Les élèves utilisent déjà des chatbots IA pour réviser. Aucune garantie que la réponse colle au programme officiel.",
    what:
      "Pipeline RAG sur base vectorielle, ingestion des programmes Éduscol, citations sourcées à chaque réponse. Eval continue sur dataset golden. Mise en service prévue 2026.",
    stack: ['TypeScript', 'Python', 'Qdrant', 'Mistral'],
    url: 'https://www.tomia.fr/',
    ctaLabel: 'Voir la landing',
    status: 'development',
    accent: 'rose',
  },
];

const STATUS = {
  live: {
    label: 'En production',
    cls: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300',
  },
  development: {
    label: 'En développement',
    cls: 'border-amber-500/30 bg-amber-500/15 text-amber-200',
  },
} as const;

const ACCENT = {
  indigo: {
    gradient: 'from-indigo-500/25 via-violet-500/15 to-transparent',
    glow: 'bg-indigo-500/[0.08]',
    hover: 'hover:border-indigo-400/30',
  },
  rose: {
    gradient: 'from-rose-500/20 via-amber-500/15 to-transparent',
    glow: 'bg-rose-500/[0.06]',
    hover: 'hover:border-rose-400/30',
  },
} as const;

export default function Projects() {
  return (
    <Section className="scroll-mt-28 pb-28" id="projets">
      <FadeOnView className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-display mb-3 text-sm font-medium uppercase tracking-[0.18em] text-brand-accent">
            Labs
          </p>
          <h2 className="font-display text-3xl font-bold leading-[1.1] text-white sm:text-4xl lg:text-5xl">
            Ce que j&apos;ai livré en solo.
          </h2>
        </div>
        <p className="max-w-md text-base leading-relaxed text-gray-400 lg:text-right">
          Deux produits IA livrés en production, de l&apos;ingestion au déploiement. Le pipeline RAG, l&apos;eval continue et le MCP que je propose en mission y tournent en conditions réelles.
        </p>
      </FadeOnView>

      {/* Asymetric: 7 / 5 on lg */}
      <div className="grid gap-6 lg:grid-cols-12">
        <FadeOnView
          className={`group relative flex flex-col overflow-hidden rounded-3xl border border-line-2 bg-surface-1 backdrop-blur-sm transition-colors duration-300 lg:col-span-7 ${ACCENT[projects[0].accent].hover}`}
          delay={0.05}
        >
          <ProjectVisual large project={projects[0]} />
          <ProjectBody project={projects[0]} />
        </FadeOnView>

        <FadeOnView
          className={`group relative flex flex-col overflow-hidden rounded-3xl border border-line-2 bg-surface-1 backdrop-blur-sm transition-colors duration-300 lg:col-span-5 ${ACCENT[projects[1].accent].hover}`}
          delay={0.15}
        >
          <ProjectVisual project={projects[1]} />
          <ProjectBody project={projects[1]} />
        </FadeOnView>
      </div>
    </Section>
  );
}

function ProjectVisual({
  project,
  large = false,
}: {
  project: FeaturedProject;
  large?: boolean;
}) {
  const accent = ACCENT[project.accent];
  const status = STATUS[project.status];
  return (
    <div
      className={`relative ${large ? 'h-56' : 'h-44'} overflow-hidden bg-gradient-to-br ${accent.gradient}`}
    >
      <div className={`absolute -left-12 -top-12 h-56 w-56 rounded-full blur-3xl ${accent.glow}`} />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />

      <div className="absolute left-5 top-5">
        <span className={`rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm ${status.cls}`}>
          {status.label}
        </span>
      </div>

      <div className="absolute inset-x-5 bottom-5">
        <h3 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-gray-300">{project.tagline}</p>
      </div>
    </div>
  );
}

function ProjectBody({ project }: { project: FeaturedProject }) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 sm:p-8">
      <div className="space-y-3 text-sm leading-relaxed">
        <p>
          <span className="mr-1 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-400/80">
            Contexte
          </span>
          <span className="text-gray-300">{project.context}</span>
        </p>
        <p>
          <span className="mr-1 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
            Ce que j&apos;ai fait
          </span>
          <span className="text-gray-300">{project.what}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-line-2 bg-surface-2 px-2 py-1 text-[11px] font-medium text-gray-300"
          >
            {tech}
          </span>
        ))}
      </div>

      <a
        className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-surface-3 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-surface-5 hover:gap-3 focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none"
        href={project.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ExternalLink aria-hidden="true" className="h-4 w-4" />
        {project.ctaLabel}
        <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 opacity-60" />
      </a>
    </div>
  );
}
