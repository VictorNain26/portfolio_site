export type Project = {
  name: string;
  tagline: string;
  stack: string[];
  url: string;
  status: 'En ligne' | 'Pré-lancement' | 'Open source' | 'Archivé';
};

export const projects: Project[] = [
  {
    name: 'AubeSonore',
    tagline:
      "Web radio diffusée 24 h/24. Chaque jour, un pipeline découvre de nouveaux morceaux, filtre leur genre, analyse l'audio et alimente l'antenne sans intervention.",
    stack: ['TypeScript', 'Python', 'PostgreSQL', 'Docker'],
    url: 'https://www.aubesonore.fr/',
    status: 'En ligne',
  },
  {
    name: 'Serveur MCP Pexels',
    tagline:
      "Donne à Claude, Cursor ou tout client MCP l'accès aux photos et vidéos Pexels : outils typés, sorties structurées, OAuth 2.1 pour le transport HTTP.",
    stack: ['Python', 'MCP', 'OAuth 2.1'],
    url: 'https://github.com/VictorNain26/pexels-mcp-server',
    status: 'Open source',
  },
  {
    name: 'La fabrique',
    tagline:
      'Cours interactif où chaque atelier ajoute un module à un agent qui tourne : garde-fous, validation humaine, repli entre fournisseurs, budget par requête, non-régression en CI.',
    stack: ['Python', 'LangGraph', 'MCP', 'Langfuse'],
    url: 'https://github.com/VictorNain26/fabrique-cours-agents',
    status: 'Open source',
  },
  {
    name: 'Index RAG Éduscol',
    tagline:
      "Index des programmes du collège, évalué sur 189 questions : le rappel au top 5 est passé de 0,81 à 0,89 en changeant de modèle d'embedding. Retiré avant mise en service, le dépôt garde la mesure.",
    stack: ['Python', 'Qdrant', 'BGE-M3'],
    url: 'https://github.com/VictorNain26/tomai-curriculum',
    status: 'Archivé',
  },
  {
    name: 'TomIA',
    tagline:
      "Tuteur socratique pour collégiens, avec supervision parentale : il guide l'élève vers la réponse au lieu de la donner. Modèles Mistral, données hébergées en Europe.",
    stack: ['TypeScript', 'Next.js', 'PostgreSQL', 'Mistral'],
    url: 'https://www.tomia.fr/',
    status: 'Pré-lancement',
  },
];
