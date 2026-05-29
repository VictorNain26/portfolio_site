/**
 * Source unique de la FAQ. Lue par le composant visible (`components/FAQ.tsx`)
 * ET par le balisage `faqJsonLd` (`app/metadata-config.ts`). Une seule copie
 * garantit que le contenu affiché et les données structurées ne divergent
 * jamais — exigence des FAQ rich results de Google.
 */
export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: 'Quel est votre tarif journalier (TJM) ?',
    answer:
      'Mon TJM démarre à 500 € selon la complexité du projet, la durée de la mission et la stack. Devis détaillé proposé après notre premier échange.',
  },
  {
    question: 'Êtes-vous disponible pour une mission ?',
    answer:
      'Je réponds sous 24 h ouvrées. Démarrage possible sous 1 à 2 semaines selon le planning en cours.',
  },
  {
    question: 'Travaillez-vous en remote ?',
    answer:
      'Oui, principalement en remote. Je suis basé en région parisienne et je me déplace ponctuellement pour les réunions de lancement ou les ateliers importants.',
  },
  {
    question: "Qu'avez-vous déjà livré côté IA ?",
    answer:
      "Deux produits IA livrés en solo : AubeSonore en production depuis 2025 (pipeline audio quotidien), TomIA en pré-prod pour 2026 (RAG sur programmes Éduscol, eval continue). Les briques que je propose en mission — serveur MCP, démo RAG, pipeline d'eval — sont publiées en open-source, lisibles avant signature. 4 ans à coder du web, dont 2 en Rails chez Capsens (fintech, 2022-2024) sur le code applicatif derrière.",
  },
  {
    question: 'Combien de temps dure un projet type ?',
    answer:
      'Un site vitrine prend 2 à 4 semaines. Une application métier, 1 à 3 mois selon le périmètre. Je privilégie les livraisons itératives pour que vous ayez de la visibilité rapidement.',
  },
  {
    question:
      'Faites-vous des interventions courtes (correction de bug, refonte, ajout de fonctionnalité) ?',
    answer:
      "Oui : bug urgent, refonte ciblée, ajout de fonctionnalité, optimisation de perf, audit de stack. Intervention à partir d'une demi-journée, devis fixe sur les périmètres bornés.",
  },
];
