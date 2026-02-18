// Configuration des métadonnées pour améliorer la lisibilité du layout

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Victor Lenain',
  alternateName: 'Victor Lenain Dev',
  jobTitle: 'Développeur Full-Stack & DevOps Freelance',
  description:
    "Développeur Full-Stack & DevOps freelance à Paris. Applications web, APIs, CI/CD, Docker et intégration IA. De l'idée au déploiement.",
  url: 'https://victorlenain.fr',
  image: 'https://victorlenain.fr/og-image.png',
  sameAs: [
    'https://www.linkedin.com/in/victor-lenain-1907b7282/',
    'https://github.com/victornain26',
  ],
  knowsAbout: [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'DevOps',
    'CI/CD',
    'Docker',
    'Intelligence Artificielle',
    'Automatisation',
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

export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quel est votre tarif journalier (TJM) ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mon TJM démarre à 500\u00a0€ selon la complexité du projet, la durée de la mission et les technologies impliquées. Je propose toujours un devis détaillé après notre premier échange.',
      },
    },
    {
      '@type': 'Question',
      name: 'Êtes-vous disponible pour une mission ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Je réponds sous 48\u00a0h et le démarrage peut être très rapide — parfois quelques jours seulement, selon ma disponibilité du moment. Contactez-moi pour en discuter.',
      },
    },
    {
      '@type': 'Question',
      name: 'Travaillez-vous en remote ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, je travaille principalement en remote. Je suis basé en région parisienne et peux me déplacer ponctuellement pour des réunions, ateliers ou phases de lancement.',
      },
    },
    {
      '@type': 'Question',
      name: 'Combien de temps dure un projet type ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un site vitrine prend 2 à 4 semaines. Une application métier, 1 à 3 mois selon le périmètre. Je privilégie les livraisons itératives pour que vous ayez de la visibilité rapidement.',
      },
    },
  ],
};

export const professionalServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Victor Lenain - Développeur Full-Stack & DevOps Freelance',
  description:
    'Services de développement web Full-Stack, DevOps et intégration IA. Applications sur mesure, APIs, CI/CD et déploiement.',
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
    'Développement Web Full-Stack',
    'DevOps & CI/CD',
    'Intégration IA & Automatisation',
    'Conseil Technique',
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