export const site = {
  name: 'Victor Lenain',
  title: 'Victor Lenain · Développeur full-stack · Intégration IA · Paris',
  tagline: 'Développeur full-stack · Intégration IA · Paris',
  description:
    "Développeur full-stack freelance à Paris. J'ajoute la couche IA (agents, RAG, automatisations) à votre produit existant, sans tout refaire.",
  email: 'victor.lenain26@gmail.com',
  calUrl: 'https://cal.com/victor-lenain-ejsjfb/echange-decouverte',
  links: {
    linkedin: 'https://www.linkedin.com/in/victorlenain/',
    github: 'https://github.com/VictorNain26',
    malt: 'https://www.malt.fr/profile/victorlenain',
  },
} as const;

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://www.victorlenain.fr/#person',
  name: site.name,
  jobTitle: 'Développeur full-stack · Intégration IA',
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
  knowsAbout: [
    'Intégration IA',
    'LLM',
    'RAG',
    'Agents IA',
    'Anthropic Claude',
    'OpenAI',
    'pgvector',
    'Développement web',
    'TypeScript',
    'Next.js',
    'Astro',
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
