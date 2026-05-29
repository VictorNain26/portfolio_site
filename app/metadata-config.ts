// Configuration des métadonnées pour améliorer la lisibilité du layout

import { faqItems } from './faq-data';

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://victorlenain.fr/#person',
  name: 'Victor Lenain',
  alternateName: 'Victor Lenain Dev',
  jobTitle: 'Développeur full-stack · Intégration IA',
  description:
    'Développeur full-stack freelance à Paris. Je greffe la couche IA (agents, RAG, automatisations LLM) sur votre stack web existante, sans refonte. Stack Next.js, Django, Rails, FastAPI, pgvector.',
  url: 'https://victorlenain.fr',
  image: 'https://victorlenain.fr/og-image.png',
  sameAs: [
    'https://www.linkedin.com/in/victorlenain/',
    'https://github.com/VictorNain26',
    'https://www.malt.fr/profile/victorlenain',
  ],
  knowsAbout: [
    'Intégration IA',
    'LLM',
    'Large Language Models',
    'Anthropic Claude',
    'OpenAI',
    'RAG',
    'Retrieval-Augmented Generation',
    'AI Agents',
    'Claude Agent SDK',
    'LangChain',
    'pgvector',
    'Prompt Engineering',
    'Développement web',
    'Next.js',
    'TypeScript',
    'Node.js',
    'React',
    'PostgreSQL',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Freelance',
    url: 'https://victorlenain.fr',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
    addressLocality: 'Paris',
    addressRegion: 'Île-de-France',
  },
  offers: {
    '@type': 'Offer',
    description: 'Développement web full-stack et intégration IA',
    category: 'Intégration IA et développement web',
  },
  potentialAction: {
    '@type': 'ReserveAction',
    target: 'https://cal.com/victor-lenain-ejsjfb/echange-decouverte',
    name: 'Prendre rendez-vous',
  },
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://victorlenain.fr/#website',
  name: 'Victor Lenain - Portfolio',
  alternateName: 'Portfolio Victor Lenain',
  url: 'https://victorlenain.fr',
  description:
    "Portfolio de Victor Lenain, développeur full-stack freelance à Paris. Greffe d'une couche IA (agents, RAG, automatisations LLM) sur votre stack web existante, sans refonte.",
  inLanguage: 'fr-FR',
  author: {
    '@id': 'https://victorlenain.fr/#person',
  },
  publisher: {
    '@id': 'https://victorlenain.fr/#person',
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

/* Généré depuis la source unique `faqItems` pour rester strictement aligné
 * sur la FAQ affichée (exigence des FAQ rich results de Google). */
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
};

export const professionalServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://victorlenain.fr/#service',
  name: 'Victor Lenain · Développeur full-stack · Intégration IA',
  description:
    "Greffe d'une couche IA (agents, RAG, automatisations LLM) sur votre stack web existante, sans refonte. Développement full-stack Next.js, Django, Rails, FastAPI. Freelance à Paris.",
  url: 'https://victorlenain.fr',
  image: 'https://victorlenain.fr/og-image.png',
  priceRange: '€€',
  availableLanguage: ['fr', 'en'],
  provider: {
    '@id': 'https://victorlenain.fr/#person',
  },
  founder: {
    '@id': 'https://victorlenain.fr/#person',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
    addressLocality: 'Paris',
    addressRegion: 'Île-de-France',
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Paris',
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Île-de-France',
    },
    {
      '@type': 'Country',
      name: 'France',
    },
  ],
  serviceType: [
    'Intégration IA',
    'Agents IA',
    'RAG',
    'Automatisation LLM',
    'Développement web full-stack',
    'Applications sur mesure',
    'Refonte de site web',
    'Conseil technique IA',
  ],
  potentialAction: {
    '@type': 'ReserveAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://cal.com/victor-lenain-ejsjfb/echange-decouverte',
      actionPlatform: [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform',
      ],
    },
    name: 'Prendre rendez-vous',
    description: 'Réserver un échange découverte gratuit de 15 minutes',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Agents IA et assistants conversationnels',
          description:
            "Agents Claude / OpenAI sur mesure : tri de mails, qualification de leads, exécution d'actions sur vos outils. Stack Claude Agent SDK ou LangChain selon le besoin.",
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'RAG et recherche sur documents',
          description:
            'Ingestion, embeddings, recherche sémantique, réponses sourcées sur vos documents internes. pgvector ou Qdrant.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Automatisations LLM sur mesure',
          description:
            'Pipelines LLM qui tournent en prod : classification, extraction, scoring, génération. Coûts tokens suivis, eval en place.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Applications web sur mesure',
          description:
            'Sites vitrines, applications métier, plateformes SaaS. Stack Next.js / TypeScript / Node.js. IA embarquée si elle apporte de la valeur.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Refonte et interventions ponctuelles',
          description:
            "Refonte visuelle, migration technique, fix urgent, ajout de fonctionnalité. À partir d'une demi-journée.",
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Conseil et audit IA',
          description:
            "Cadrage prototype, choix de stack et coûts, audit d'un projet existant. Arbitrage entre script classique, no-code et intégration LLM.",
        },
      },
    ],
  },
};
