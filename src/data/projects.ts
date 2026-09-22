export type Project = {
  name: string;
  tagline: string;
  stack: string[];
  url: string;
  status: 'En ligne' | 'En développement';
};

export const projects: Project[] = [
  {
    name: 'AubeSonore',
    tagline:
      'Web radio indépendante diffusée 24/7, dont la programmation est choisie chaque jour par un pipeline IA.',
    stack: ['TypeScript', 'Python', 'Docker'],
    url: 'https://www.aubesonore.fr/',
    status: 'En ligne',
  },
  {
    name: 'TomIA',
    tagline:
      'Tuteur IA aligné sur les programmes Éduscol, avec des réponses sourcées à chaque question.',
    stack: ['TypeScript', 'Python', 'Qdrant', 'Mistral'],
    url: 'https://www.tomia.fr/',
    status: 'En développement',
  },
];
