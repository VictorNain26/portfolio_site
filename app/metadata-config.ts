// Configuration des métadonnées pour améliorer la lisibilité du layout

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Victor Lenain',
  alternateName: 'Victor Lenain Dev',
  jobTitle: 'Développeur Full-Stack JavaScript & Expert Next.js',
  description:
    "Développeur Full-Stack JavaScript spécialisé en Next.js 15, React 19 et DevOps. Expert en création d'applications web modernes et performantes.",
  url: 'https://victorlenain.fr',
  image: 'https://victorlenain.fr/og-image.png',
  sameAs: [
    'https://www.linkedin.com/in/victor-lenain-1907b7282/',
    'https://github.com/victornain26',
  ],
  knowsAbout: [
    'JavaScript',
    'TypeScript',
    'Next.js',
    'React',
    'Node.js',
    'DevOps',
    'Intelligence Artificielle',
    'Développement Web',
    'Applications Web',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Freelance',
    url: 'https://victorlenain.fr',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
    addressLocality: 'France',
  },
  offers: {
    '@type': 'Offer',
    description: 'Services de développement web Full-Stack',
    category: 'Développement Web',
  },
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Website',
  name: 'Victor Lenain - Portfolio',
  alternateName: 'Portfolio Victor Lenain',
  url: 'https://victorlenain.fr',
  description:
    'Portfolio professionnel de Victor Lenain, développeur Full-Stack JavaScript spécialisé en Next.js et React.',
  inLanguage: 'fr-FR',
  author: {
    '@type': 'Person',
    name: 'Victor Lenain',
  },
  publisher: {
    '@type': 'Person',
    name: 'Victor Lenain',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://victorlenain.fr/blog?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
  mainEntity: {
    '@type': 'SiteNavigationElement',
    name: 'Navigation principale',
    hasPart: [
      {
        '@type': 'SiteNavigationElement',
        name: 'Accueil',
        description: 'Portfolio et présentation de Victor Lenain',
        url: 'https://victorlenain.fr',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'À propos',
        description: 'Expérience et compétences techniques',
        url: 'https://victorlenain.fr#a-propos',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Projets',
        description: 'Portfolio des réalisations et projets',
        url: 'https://victorlenain.fr#projets',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Blog',
        description: 'Articles techniques et tutoriels',
        url: 'https://victorlenain.fr/blog',
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Contact',
        description: 'Formulaire de contact et informations',
        url: 'https://victorlenain.fr#contact',
      },
    ],
  },
};

export const professionalServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Victor Lenain - Services de Développement Web',
  description:
    'Services professionnels de développement web Full-Stack avec Next.js, React et TypeScript.',
  url: 'https://victorlenain.fr',
  image: 'https://victorlenain.fr/og-image.png',
  provider: {
    '@type': 'Person',
    name: 'Victor Lenain',
  },
  areaServed: {
    '@type': 'Country',
    name: 'France',
  },
  serviceType: [
    'Développement Web',
    'Applications Next.js',
    'Conseil Technique',
    'Formation JavaScript',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services de développement',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: "Développement d'applications web",
          description: "Création d'applications web modernes avec Next.js et React",
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Conseil technique',
          description: 'Conseil en architecture et choix technologiques',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Formation',
          description: 'Formation aux technologies modernes JavaScript',
        },
      },
    ],
  },
};