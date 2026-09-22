export const site = {
  name: 'Victor Lenain',
  title: 'Victor Lenain · Développeur full-stack · Systèmes IA · Paris',
  tagline: 'Développeur full-stack · Systèmes IA · Paris',
  description:
    "Développeur full-stack à Paris, et bidouilleur le reste du temps. Mes projets perso, surtout autour de l'IA, et ce qu'ils m'apprennent.",
  email: 'victor.lenain26@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/victorlenain/',
    github: 'https://github.com/VictorNain26',
  },
} as const;

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://www.victorlenain.fr/#person',
  name: site.name,
  jobTitle: 'Développeur full-stack · Systèmes IA',
  description: site.description,
  url: 'https://www.victorlenain.fr',
  image: 'https://www.victorlenain.fr/og.png',
  email: `mailto:${site.email}`,
  sameAs: Object.values(site.links),
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
    addressLocality: 'Paris',
    addressRegion: 'Île-de-France',
  },
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    name: 'Claude Certified Architect – Foundations',
    credentialCategory: 'certification',
    dateCreated: '2026-09',
    recognizedBy: { '@type': 'Organization', name: 'Anthropic', url: 'https://www.anthropic.com' },
  },
  alumniOf: [
    { '@type': 'EducationalOrganization', name: 'Le Wagon' },
    { '@type': 'EducationalOrganization', name: 'OpenClassrooms' },
  ],
  memberOf: { '@type': 'Organization', name: 'Growth Wave — AI Crew' },
  knowsAbout: [
    'Agents IA',
    'RAG',
    'Model Context Protocol',
    'Évaluation de systèmes IA',
    'Anthropic Claude',
    'Claude Agent SDK',
    'LangGraph',
    'Mistral',
    'pgvector',
    'Qdrant',
    'TypeScript',
    'Python',
    'Next.js',
    'PostgreSQL',
  ],
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.victorlenain.fr/#website',
  name: site.name,
  url: 'https://www.victorlenain.fr',
  inLanguage: 'fr-FR',
  publisher: { '@id': personJsonLd['@id'] },
};
