/**
 * Content source for the `/services/*` routes. Kept in one file so each
 * service page is a thin shell that reads from here. Update copy here, the
 * route renders, the sitemap picks it up.
 */

import type { LucideIcon } from 'lucide-react';
import { Bot, Database, Workflow, Rocket, Wrench, Sparkles } from 'lucide-react';

export type ServiceSlug =
  | 'agents-ia'
  | 'rag-recherche-documents'
  | 'automatisations-llm'
  | 'applications-web'
  | 'refonte-intervention'
  | 'conseil-audit-ia';

export type Service = {
  slug: ServiceSlug;
  /** Card / nav / breadcrumb. Short. */
  shortTitle: string;
  /** Page H1. Full sentence, optimized for AI-SEO. */
  title: string;
  /** One-line under H1. */
  tagline: string;
  /** Étage « dirigeant » : le résultat concret pour le client, en langage
   * business sans jargon, rendu en tête de page avant la profondeur technique. */
  outcome: string;
  /** <meta name="description">. ~140-160 chars. */
  metaDescription: string;
  /** SEO keywords. */
  keywords: string[];
  icon: LucideIcon;
  /** Visual accent. */
  accent: 'indigo' | 'violet' | 'cyan' | 'sky' | 'amber' | 'emerald';
  /** Hero section bullet list (3 quick points). */
  highlights: string[];
  /** "Le problème" — 1-2 paragraphs of context. */
  problem: string[];
  /** "Mon approche" — 1-2 paragraphs of how I work on it. */
  approach: string[];
  /** Tech stack chips. */
  stack: string[];
  /** Worked examples. */
  useCases: { title: string; description: string }[];
  /** Service-specific FAQ. */
  faq: { question: string; answer: string }[];
  /** CTA button label. */
  ctaLabel: string;
  /** Phare = main IA differentiator, secondaire = supporting offer. */
  tier: 'featured' | 'secondary';
};

export const services: Service[] = [
  {
    slug: 'agents-ia',
    shortTitle: 'Agents IA',
    title: 'Agents IA et assistants conversationnels sur mesure',
    tagline:
      'Un agent qui exécute trois workflows précis dans votre produit, pas un chatbot vitrine de plus.',
    outcome:
      "Vos équipes arrêtent de trier, qualifier et répondre à la main sur les tâches répétitives. L'agent prend en charge trois actions précises de votre quotidien. Dès qu'il sort de son périmètre, il passe la main à un humain. Pas de réponse inventée, pas de dérapage.",
    metaDescription:
      "Intégration d'agents conversationnels dans votre stack web : appels d'outils internes, garde-fous, eval continue. Développeur full-stack freelance, Paris.",
    keywords: [
      'agents IA',
      'agent conversationnel',
      'tool use',
      'développeur agents IA Paris',
      'freelance LLM',
      'intégration LLM',
    ],
    icon: Bot,
    accent: 'indigo',
    highlights: [
      'Trois workflows bornés, pas un assistant qui prétend en faire trente',
      'Greffé sur votre stack actuelle (Next, Django, FastAPI), sans refonte',
      'Eval dès le premier sprint avec dataset de référence et coûts tokens trackés',
    ],
    problem: [
      "Un assistant conversationnel répond à une question. Un agent prend une décision, appelle un outil, écrit dans une base. La plupart des équipes veulent automatiser le tri de leads entrants, la qualification d'emails ou la première réponse support, et finissent avec un wrapper LLM qui invente ou un workflow no-code qui craque dès que le volume monte.",
      "Du coup la vraie question n'est pas \"quel modèle\". C'est : qu'est-ce qui se passe quand un appel d'outil échoue, quand le contexte dépasse la fenêtre, quand l'utilisateur sort du scope prévu. Si vous n'avez pas de réponse écrite à ces trois cas, l'agent ne tiendra pas en prod.",
    ],
    approach: [
      "Je borne l'agent sur trois workflows précis avec un schéma d'entrée et de sortie typés. Chaque appel d'outil passe par votre API existante, jamais par une réécriture de votre back-office. L'agent ne sait pas faire autre chose que ces trois choses, et c'est ce qui le rend fiable.",
      "Eval en place dès le premier sprint sur un dataset de cas réels que vous validez. Coûts tokens estimés au cadrage et trackés en prod avec un dashboard. Retry et fallback prévus si l'API du modèle tombe. Logs structurés pour rejouer une session à l'identique en cas de comportement étrange.",
    ],
    stack: ['TypeScript', 'Python', 'FastAPI', 'Anthropic Claude', 'OpenAI', 'Langfuse'],
    useCases: [
      {
        title: 'Tri et qualification de leads entrants',
        description:
          "L'agent lit les formulaires entrants, extrait les champs structurés, score selon votre ICP écrit noir sur blanc, route vers le bon commercial avec un commentaire justifié. Les cas hors ICP ou ambigus partent en file d'attente humaine au lieu de générer une réponse hasardeuse.",
      },
      {
        title: 'Assistant interne sur documentation technique',
        description:
          "Branché sur votre Notion ou Confluence en RAG, l'agent répond avec citation systématique vers le doc source. Les questions \"où est la procédure X\" sortent du flux Slack des seniors. Si la réponse n'est pas dans la base, l'agent le dit au lieu d'improviser.",
      },
      {
        title: 'Agent support de niveau 1',
        description:
          "Lecture des tickets entrants, brouillon de réponse posé en draft pour validation humaine au démarrage. Une fois la qualité mesurée sur un dataset golden, passage en autonome sur les catégories où l'eval valide le seuil que vous avez fixé. Le reste reste humain.",
      },
    ],
    faq: [
      {
        question: 'Combien coûte un agent IA en production par mois ?',
        answer:
          'Ça dépend du volume et du modèle. Un agent qui traite environ 1 000 requêtes par mois sur un modèle milieu de gamme tourne entre 30 et 200 € de tokens. Je vous chiffre au cadrage avec vos hypothèses de volume écrites, pour que vous puissiez challenger ligne par ligne.',
      },
      {
        question: 'Comment éviter les hallucinations ?',
        answer:
          "On ne les supprime pas, on les rend rares et détectables. Réponses contraintes par les outils que l'agent peut appeler (pas de génération libre), citation des sources via RAG quand il faut puiser dans un corpus, eval continue sur un jeu de cas connus qui détecte les régressions avant la prod. Fallback humain prévu sur les cas où la confiance n'est pas atteinte.",
      },
      {
        question: 'Quelle différence avec un workflow no-code (n8n, Make) ?',
        answer:
          "Le no-code reste plus rapide pour des automatisations linéaires à faible volume. Dès qu'il faut du raisonnement multi-étapes, du contexte conversationnel, ou un contrôle fin sur les appels d'outils, le code dédié finit moins cher à maintenir et plus simple à monitorer.",
      },
    ],
    ctaLabel: 'Discuter de votre besoin agent',
    tier: 'featured',
  },
  {
    slug: 'rag-recherche-documents',
    shortTitle: 'RAG documents',
    title: 'RAG et recherche sémantique sur vos documents',
    tagline:
      'Vos documents internes interrogeables en langage naturel, avec citation obligatoire vers la source.',
    outcome:
      "Vos équipes retrouvent en quelques secondes une information noyée dans des années de documents, avec la source pour vérifier. Plus besoin de demander à la seule personne qui sait. Et pas de réponse qui a l'air juste sans l'être.",
    metaDescription:
      'Recherche sémantique sur vos documents internes : pgvector ou Qdrant, embeddings adaptés à votre langue, citations vérifiables, eval continue. Freelance Paris.',
    keywords: [
      'RAG',
      'retrieval augmented generation',
      'pgvector',
      'Qdrant',
      'embeddings',
      'recherche sémantique',
      'recherche documents IA',
      'développeur RAG France',
    ],
    icon: Database,
    accent: 'violet',
    highlights: [
      'pgvector si vous tournez déjà sur PostgreSQL, Qdrant au-delà du million de chunks',
      'Citation obligatoire dans la réponse, vérifiée contre les sources retournées',
      'Eval recall@k et faithfulness mesurés à chaque déploiement',
    ],
    problem: [
      'Une PME de 50 personnes a trois ans de documents éparpillés sur Drive, Notion et Slack. Personne ne retrouve la procédure support de l\'an dernier, le contrat signé avec ce client, ou la décision technique de 2024. Le réflexe "on demande à Marie" ne scale pas, et Marie part en vacances.',
      "Brancher un assistant générique sur un export Drive donne des réponses qui ressemblent à la vérité et qui sont fausses. C'est pire qu'une absence de réponse parce que personne ne sait que c'est faux.",
    ],
    approach: [
      "Pipeline complète d'ingestion depuis vos sources (Drive, Notion, Confluence, PDF, base interne) avec découpage qui respecte la structure du document. Embeddings choisis selon la langue principale de votre corpus. Stockage dans pgvector si vous êtes déjà sur PostgreSQL, Qdrant si on dépasse le million de chunks ou s'il faut du filtrage multi-tenant.",
      "Recherche sémantique avec reranking, génération sous contrainte de citation, vérification post-génération que chaque citation existe dans les sources retournées. Pipeline d'indexation incrémentale pour ne pas tout rebâtir à chaque mise à jour. Eval recall@k et faithfulness mesurés sur un dataset golden que vous validez au cadrage.",
    ],
    stack: ['pgvector', 'Qdrant', 'Mistral Embed', 'Anthropic Claude', 'Ragas', 'Python'],
    useCases: [
      {
        title: 'Assistant sur jurisprudence ou contrats internes',
        description:
          "Recherche sur plusieurs années de contrats ou de délibérations internes. Réponse avec l'extrait exact cité et un lien vers le document d'origine. Quand le corpus ne contient pas la réponse, le système le dit au lieu de combler le vide.",
      },
      {
        title: 'Onboarding développeurs sur codebase legacy',
        description:
          'Indexation de la doc, des PR mergées et des ADR de votre codebase. Un nouveau dev pose sa question, obtient une réponse avec liens vers le code concerné. Les seniors arrêtent de répéter les mêmes explications trois fois par semaine.',
      },
      {
        title: 'Support produit B2B sur documentation technique',
        description:
          "Réponse aux questions d'intégration en citant la doc API publique, avec lien direct vers la section. Le ticket de niveau 1 baisse sans cacher la doc derrière un chatbot frustrant : le lien reste là, le client peut vérifier.",
      },
    ],
    faq: [
      {
        question: 'pgvector ou Qdrant, comment choisir ?',
        answer:
          "pgvector si vous avez déjà PostgreSQL et moins d'un million de chunks. Une dépendance en moins à opérer, des requêtes hybrides faciles avec le reste de votre schéma métier. Qdrant au-delà, ou quand vous avez besoin de filtrage multi-tenant fin ou de réplicas dédiés à la recherche.",
      },
      {
        question: 'Comment vous garantissez que les réponses ne sont pas hallucinées ?',
        answer:
          "Citation obligatoire dans le prompt système, vérification post-génération que chaque citation existe dans les sources retournées, eval continue sur un dataset de questions de référence. Une réponse non sourçable est rejetée ou marquée incertaine côté UI plutôt qu'affichée comme un fait.",
      },
      {
        question: 'Combien de documents au maximum ?',
        answer:
          "L'infra tient des millions de chunks sans effort. La vraie limite, c'est la qualité du découpage et la pertinence du modèle d'embedding sur votre vocabulaire métier. Au cadrage on valide ça sur un échantillon représentatif avant d'industrialiser l'ingestion complète.",
      },
    ],
    ctaLabel: 'Discuter de votre projet RAG',
    tier: 'featured',
  },
  {
    slug: 'automatisations-llm',
    shortTitle: 'Automatisations LLM',
    title: 'Automatisations LLM sur mesure pour vos processus métier',
    tagline:
      'Pipelines en prod pour vos process répétitifs : classification, extraction, scoring, génération encadrée.',
    outcome:
      "Une tâche répétitive sur du texte (classer, extraire, rédiger, scorer) passe de plusieurs heures par jour à un traitement automatique. Le coût est connu d'avance et suivi mois après mois. Votre équipe récupère ce temps pour le reste.",
    metaDescription:
      'Pipelines LLM en production sur vos process métier : classification, extraction structurée, scoring, génération. Coûts tokens trackés, eval automatique, retry.',
    keywords: [
      'automatisation LLM',
      'pipeline LLM',
      'classification IA',
      'extraction structurée',
      'scoring IA',
      'automatisation IA freelance',
    ],
    icon: Workflow,
    accent: 'cyan',
    highlights: [
      'Code Python ou Node.js avec tests, retry et batch, pas un empilement no-code',
      'Sortie typée et validée par schéma, jamais du texte libre balancé en aval',
      'Coûts tokens estimés au cadrage et suivis en prod via dashboard',
    ],
    problem: [
      "Vous avez un process répétitif qui coûte du temps humain : classifier 500 emails par jour, extraire les champs structurés de 50 factures, générer des descriptions produits à partir de specs techniques, scorer un lead à partir de signaux multiples. C'est du travail à la chaîne sur du langage, c'est exactement ce qu'un LLM fait bien quand on l'encadre.",
      "Le piège, c'est d'empiler les briques no-code jusqu'à ce que la facture mensuelle dépasse le coût d'un dev. Les vrais workflows demandent du code pour le retry, le batch, le monitoring et un coût maîtrisé à long terme.",
    ],
    approach: [
      'Pipeline codée en Python ou Node.js comme du vrai code : sortie typée et validée par schéma (Pydantic, Zod), tests sur les cas connus, retry avec backoff, batch quand le volume le justifie. Coûts tokens estimés au cadrage avec hypothèses écrites, puis trackés en prod sur un dashboard que vous lisez sans moi.',
      'Eval automatique sur un dataset de référence : si la qualité baisse après un changement de modèle ou un ajustement de prompt, vous le voyez avant la prod. Chaque choix (modèle, prompt, batch size) est justifié par des chiffres mesurés sur votre corpus, pas par mode.',
    ],
    stack: ['Python', 'Node.js', 'Pydantic', 'Anthropic Claude', 'OpenAI', 'Langfuse'],
    useCases: [
      {
        title: 'Extraction structurée depuis factures et PDF',
        description:
          "Document en entrée, JSON validé par schéma en sortie. Sur des formats répétitifs (factures d'un même fournisseur, formulaires standards), les exceptions détectées par la pipeline partent en validation humaine au lieu de polluer la base. Le taux exact se mesure sur votre corpus au cadrage.",
      },
      {
        title: 'Génération de descriptions produits e-commerce',
        description:
          "Spec technique et fiche produit en entrée, description SEO en sortie respectant votre charte éditoriale, déclinée par marché si besoin. Pipeline en mode batch pour traiter un catalogue large d'un coup avec un coût par fiche connu d'avance.",
      },
      {
        title: 'Scoring de leads B2B multi-signaux',
        description:
          "Données enrichies (site, signaux d'usage, profil public) en entrée, score 0-100 avec justification textuelle en sortie. Pipeline schedulée quotidiennement, alerte commerciale sur les leads qui passent le seuil que vous fixez.",
      },
    ],
    faq: [
      {
        question: "Quel est le coût typique d'une pipeline LLM en production ?",
        answer:
          "De quelques euros par mois sur des volumes faibles avec un petit modèle, à plusieurs milliers sur des millions de requêtes mensuelles. J'estime au cadrage à partir de votre volume cible, avec un buffer explicite pour les pics. Vous repartez avec un fichier chiffré, vérifiable poste par poste.",
      },
      {
        question: 'Vous utilisez quel modèle par défaut ?',
        answer:
          "Ça dépend de la tâche. Modèle léger sur les classifications simples pour le rapport coût/qualité. Modèle plus gros sur les tâches qui demandent du raisonnement multi-étapes. Modèle européen quand l'hébergement EU est une contrainte contractuelle. Le choix se justifie par des chiffres mesurés au cadrage, pas par préférence.",
      },
      {
        question: 'Comment gérez-vous les ratés ?',
        answer:
          "Retry avec backoff exponentiel sur les erreurs transitoires, fallback vers un modèle plus simple si le principal timeout, logs structurés qui permettent de rejouer un job à l'identique, dead-letter queue pour les cas qu'un humain doit traiter à la main. Aucun job ne disparaît silencieusement.",
      },
    ],
    ctaLabel: 'Cadrer une automatisation',
    tier: 'featured',
  },
  {
    slug: 'applications-web',
    shortTitle: 'Applications web',
    title: 'Applications web sur mesure (Next.js, TypeScript, Node.js)',
    tagline:
      'Sites vitrines, applications métier, plateformes SaaS. Du cadrage au déploiement, par un dev qui code en Next.js et Rails depuis 4 ans.',
    outcome:
      'Vous obtenez une application qui sort, qui tourne et que vos utilisateurs utilisent vraiment. Du cadrage à la mise en ligne, en livraisons régulières. Pas de tunnel de plusieurs mois où vous ne voyez rien avancer.',
    metaDescription:
      "Développeur full-stack freelance à Paris. Applications web sur mesure en Next.js, TypeScript, Node.js, Ruby on Rails et PostgreSQL. 4 ans d'expérience, dont 2 sur du Rails métier.",
    keywords: [
      'développeur Next.js Paris',
      'développeur TypeScript freelance',
      'application web sur mesure',
      'développeur full-stack',
      'SaaS sur mesure',
    ],
    icon: Rocket,
    accent: 'sky',
    highlights: [
      '4 ans à coder du web métier, dont 2 en Rails chez Capsens (fintech, 2022-2024)',
      'Next.js 15, TypeScript strict, PostgreSQL, Rails 7 selon le contexte',
      "Couche IA branchée sur l'existant quand elle apporte une vraie valeur",
    ],
    problem: [
      'Vous avez un produit, un service, ou une équipe interne qui galère sur un outil maison vieillissant. Vous cherchez un dev qui prend le projet en main du cadrage à la mise en ligne, qui code lisible, et qui sait quand il faut rester simple.',
      "La plupart des prestas vous vendent un template WordPress maquillé ou une SPA React de 4 Mo pour un site vitrine. Les deux sont à côté de la plaque. Une application web sur mesure, c'est du code lu plus souvent qu'il n'est écrit, et déployé sans drame.",
    ],
    approach: [
      'Je prends le projet du cadrage au déploiement. Stack selon le contexte : Next.js 15 + TypeScript pour un produit moderne, Rails 7 + PostgreSQL si vous avez besoin de monter vite sur du métier, Node.js pour les APIs. Tests sur les parties qui le méritent, pas sur le CRUD trivial.',
      "Si vous voulez greffer du LLM sur l'app (résumé automatique, classification d'inputs, recherche sémantique sur vos contenus), on en parle au cadrage et on chiffre. Sinon, je livre l'app web sans pousser de l'IA partout. Le but, c'est que le projet sorte et tourne.",
    ],
    stack: ['Next.js 15', 'TypeScript', 'React 19', 'Ruby on Rails', 'Node.js', 'PostgreSQL'],
    useCases: [
      {
        title: 'Plateforme SaaS B2B (auth, paiement, dashboard)',
        description:
          "Auth, paiement Stripe, dashboard multi-tenant, facturation. Stack Next.js ou Rails selon ce qui colle au reste de votre SI. Pas de sur-architecture tant que vous n'avez pas 1 000 clients.",
      },
      {
        title: 'Site vitrine performant et indexable',
        description:
          'Pas de SPA quand un rendu serveur suffit. Core Web Vitals dans le vert, indexation propre, accessibilité prise au sérieux dès la maquette, pas refondue à la fin.',
      },
      {
        title: 'Application interne métier',
        description:
          "Outil métier connecté à votre CRM, votre ERP ou votre base interne. Modèle de données pensé pour durer, écrans pour les gens qui s'en servent 8 h par jour, pas pour la démo commerciale.",
      },
    ],
    faq: [
      {
        question: 'Combien de temps pour un site vitrine ?',
        answer:
          "Un site vitrine propre tient en 2 à 4 semaines selon les contenus disponibles côté client. Si le copywriting et les visuels sont à produire de votre côté, c'est souvent ça qui dicte le calendrier, pas le code.",
      },
      {
        question: 'Pour une application métier ?',
        answer:
          '1 à 3 mois en livraison itérative. Première version utilisable en 4 à 6 semaines, puis points hebdo pour ajuster. Pas de tunnel de 4 mois où vous ne voyez rien.',
      },
    ],
    ctaLabel: 'Cadrer un projet web',
    tier: 'secondary',
  },
  {
    slug: 'refonte-intervention',
    shortTitle: 'Refonte & interventions',
    title: 'Refonte et interventions ponctuelles',
    tagline:
      "Site lent, framework abandonné, bug en prod qui revient. Vous n'avez pas besoin d'un projet de 3 mois, juste de quelqu'un qui ouvre le capot et répare.",
    outcome:
      "Votre site existant redevient rapide, stable et maintenable, sans tout réécrire ni casser votre référencement. Vous payez du temps d'intervention ciblé, facturé à la demi-journée. Pas un forfait de refonte que vous ne vouliez pas.",
    metaDescription:
      'Interventions ponctuelles sur site existant : migration de framework, optimisation Core Web Vitals, fix de bug en prod, ajout de fonctionnalité. Demi-journée minimum, devis avant intervention.',
    keywords: [
      'refonte site web',
      'migration framework',
      'optimisation performances web',
      'correction bug production',
      'développeur intervention ponctuelle',
    ],
    icon: Wrench,
    accent: 'amber',
    highlights: [
      'Demi-journée minimum, pas de package 3 mois imposé',
      "Audit court + plan chiffré avant qu'on touche au code",
      'On ne casse ni le SEO, ni les permaliens, ni la prod',
    ],
    problem: [
      "Votre site existe et marche à peu près. Sauf qu'il rame en mobile, le code a été touché par trois prestas successifs, le framework est en fin de vie, et un bug revient toutes les deux semaines en prod. Vous n'allez pas tout réécrire pour ça.",
      "Ce qu'il vous faut, c'est un dev qui lit le code existant, comprend ce qui s'y passe, et corrige proprement sans tout retoquer. Du temps d'intervention vendu à la demi-journée, pas un forfait de refonte à 30 k€.",
    ],
    approach: [
      "Demi-journée minimum. D'abord 1 à 2 heures d'audit pour lire le code, comprendre l'historique et identifier la cause racine. Ensuite un plan chiffré : ce qu'on touche, ce qu'on laisse, le risque associé. Vous validez, j'exécute. Pas de surprise sur la facture.",
      'Je préfère réparer que réécrire. Une migration de framework se fait en branches, par modules, avec rollback possible à chaque étape. Une optimisation Core Web Vitals se mesure avant et après, avec des chiffres. Un fix en prod se livre avec un test qui empêche la régression.',
    ],
    stack: ['Next.js', 'React', 'Vue', 'Ruby on Rails', 'Node.js', 'WordPress'],
    useCases: [
      {
        title: 'Migration React 17 → 19 ou Next.js majeur',
        description:
          'Plan progressif, branches feature, déploiement par étapes. Pas de big bang du vendredi soir qui casse la prod du lundi matin.',
      },
      {
        title: "Refonte visuelle d'un site vitrine vieillissant",
        description:
          "On garde les URLs qui rankent, on redirige proprement celles qui changent, on mesure le SEO avant et après. Le design refait n'a aucune raison de tuer votre trafic organique.",
      },
      {
        title: 'Fix urgent en production',
        description:
          "Bug critique sur l'app, je m'y mets vite et je me cale sur l'astreinte de votre équipe si besoin. Livraison avec un test qui couvre le cas, pour qu'il ne revienne pas dans trois semaines.",
      },
    ],
    faq: [
      {
        question: "Vous pouvez intervenir sur n'importe quelle stack ?",
        answer:
          "Technos web courantes : React, Next.js, Vue, Rails, Node, Python, WordPress. Sur des stacks plus rares (Elixir, Go, .NET legacy), je vous le dis avant de signer pour ne pas vous facturer mon temps d'apprentissage.",
      },
      {
        question: 'Combien coûte une intervention courte ?',
        answer:
          'TJM à 500 € HT, facturable à la demi-journée (250 €). Un fix simple tient souvent en une demi-journée. Sur un périmètre clair, je peux donner un forfait fixe au lieu du TJM.',
      },
    ],
    ctaLabel: 'Décrire votre besoin',
    tier: 'secondary',
  },
  {
    slug: 'conseil-audit-ia',
    shortTitle: 'Conseil & audit IA',
    title: 'Conseil et audit IA : cadrage, arbitrage, revue',
    tagline:
      "Avant de coder, on regarde si l'IA est vraiment le bon outil. Audit indépendant pour PME et scale-ups, livré en note synthétique signée.",
    outcome:
      'Vous prenez votre décision IA en connaissance de cause : ce que ça coûte, ce que ça rapporte, et si ça vaut le coup. Le tout dans une note écrite et signée, lisible en comité de direction. Pas un argumentaire déguisé pour vous vendre la mission qui suit.',
    metaDescription:
      "Audit IA et cadrage de prototype LLM pour PME et scale-ups. Arbitrage de stack, estimation coûts tokens, revue d'architecture. Note synthétique remise sous 1 à 5 jours.",
    keywords: [
      'audit IA',
      'conseil IA freelance',
      'cadrage prototype IA',
      'consultant LLM',
      'audit projet IA',
    ],
    icon: Sparkles,
    accent: 'emerald',
    highlights: [
      'Avis tranché et écrit, livré en note signée',
      "Si l'IA n'est pas la bonne réponse, je vous l'écris noir sur blanc",
      'Note de synthèse signée, lisible par un comité de direction',
    ],
    problem: [
      "Une PME hésite à embarquer du LLM dans son produit et ne sait pas par où commencer. Une scale-up a déjà un prototype qui tourne et redoute la facture du fournisseur le mois où le trafic monte. Un comité de direction se demande s'il faut entendre l'éditeur qui leur promet une révolution agentique.",
      "Dans les trois cas, vous avez besoin d'un avis qui ne vend rien d'autre que la décision. Pas le dev qui veut placer 3 mois de mission. Pas le cabinet qui facture un slide deck à 25 k€. Un dev indépendant qui regarde, écrit ce qu'il pense, et signe.",
    ],
    approach: [
      "Je lis votre code, vos prompts, votre architecture, vos coûts actuels. Je liste les choix qui vont vous coûter cher s'ils sont mal pris : modèle, structure de prompt, infra de retrieval, évaluation, fournisseur. Puis je vous remets une note de 4 à 10 pages, signée, avec recommandations classées par priorité.",
      "Si après audit ma conclusion c'est que l'IA n'apporte rien à votre cas et qu'une règle métier ou un script Python suffit, je l'écris dans la note. Vous me payez l'audit, pas un argumentaire pour vendre la mission qui suit.",
    ],
    stack: ['Anthropic', 'OpenAI', 'Mistral', 'pgvector', 'Ragas', 'Langfuse'],
    useCases: [
      {
        title: "Cadrage d'un prototype IA",
        description:
          "1 à 2 semaines. Livrable : périmètre découpé en lots, choix de modèle et d'infra justifié, budget tokens estimé sur 6 mois, plan d'évaluation avec dataset de référence à constituer.",
      },
      {
        title: "Audit d'un projet IA déjà lancé",
        description:
          '3 à 5 jours. Revue du code et des prompts, listing des risques (coûts qui dérapent, hallucinations non détectées, latence, dépendance fournisseur), actions classées par impact et effort.',
      },
      {
        title: 'Avis sur un choix de stack',
        description:
          "1 demi-journée à 2 jours selon l'enjeu. Vous comparez deux ou trois options de stack, je rends une note de 2 à 4 pages avec recommandation tranchée et le raisonnement derrière.",
      },
    ],
    faq: [
      {
        question: 'Vous donnez un avis même si vous ne faites pas ensuite le projet ?',
        answer:
          "Oui, et c'est même le but. Un audit a de la valeur uniquement s'il est indépendant de la mission qui suivrait. Si après lecture je pense que le projet n'a pas de sens, ou qu'un autre presta serait mieux placé, c'est dans la note. Vous payez mon avis, pas ma prochaine facture.",
      },
      {
        question: 'Combien coûte un audit ?',
        answer:
          "TJM à 500 € HT. Un avis tranché sur un choix de stack tient en 1 à 2 jours (500 à 1 000 €). Un audit léger sur projet existant : 3 jours (1 500 €). Un audit approfondi avec lecture de code et revue d'archi : 5 jours (2 500 €). Devis fixe avant de commencer.",
      },
    ],
    ctaLabel: 'Commander un audit',
    tier: 'secondary',
  },
];

export function getService(slug: string): Service | undefined {
  return services.find(s => s.slug === slug);
}

/** Tailwind classes per accent. The Tailwind scanner reads source files as
 * static text, so `hover:` variants must be pre-composed here as literal
 * strings — never built at runtime via concat (those would be purged from
 * the production bundle). */
export const ACCENT_CLASSES: Record<
  Service['accent'],
  {
    text: string;
    bg: string;
    border: string;
    hoverBorder: string;
    chip: string;
    gradient: string;
    glow: string;
  }
> = {
  indigo: {
    text: 'text-indigo-300',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-400/30',
    hoverBorder: 'hover:border-indigo-400/30',
    chip: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    gradient: 'from-indigo-500/25 via-violet-500/15 to-transparent',
    glow: 'bg-indigo-500/[0.08]',
  },
  violet: {
    text: 'text-violet-300',
    bg: 'bg-violet-500/10',
    border: 'border-violet-400/30',
    hoverBorder: 'hover:border-violet-400/30',
    chip: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    gradient: 'from-violet-500/25 via-fuchsia-500/15 to-transparent',
    glow: 'bg-violet-500/[0.08]',
  },
  cyan: {
    text: 'text-cyan-300',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-400/30',
    hoverBorder: 'hover:border-cyan-400/30',
    chip: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    gradient: 'from-cyan-500/25 via-sky-500/15 to-transparent',
    glow: 'bg-cyan-500/[0.08]',
  },
  sky: {
    text: 'text-sky-300',
    bg: 'bg-sky-500/10',
    border: 'border-sky-400/30',
    hoverBorder: 'hover:border-sky-400/30',
    chip: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    gradient: 'from-sky-500/25 via-blue-500/15 to-transparent',
    glow: 'bg-sky-500/[0.08]',
  },
  amber: {
    text: 'text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'border-amber-400/30',
    hoverBorder: 'hover:border-amber-400/30',
    chip: 'bg-amber-500/10 text-amber-200 border-amber-500/20',
    gradient: 'from-amber-500/25 via-orange-500/15 to-transparent',
    glow: 'bg-amber-500/[0.08]',
  },
  emerald: {
    text: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400/30',
    hoverBorder: 'hover:border-emerald-400/30',
    chip: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    gradient: 'from-emerald-500/25 via-teal-500/15 to-transparent',
    glow: 'bg-emerald-500/[0.08]',
  },
};
