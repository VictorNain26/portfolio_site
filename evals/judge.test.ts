import { createMistral } from '@ai-sdk/mistral';
import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createFactJudge, JUDGE_MODEL, withoutInvitations } from './judge';

describe('withoutInvitations', () => {
  it('drops the invitation to write that the agent is told to give', () => {
    expect(
      withoutInvitations([
        'le plus simple est de lui écrire',
        'écrire à Victor',
        'écrire à Victor Lenain.',
      ]),
    ).toEqual([]);
  });

  it('keeps a real promise, even one about writing', () => {
    const promises = [
      'je lui transmets ta question et il te répondra par mail',
      "Je peux demander à Victor de t'envoyer un accès à la bêta.",
      'je lui écrirai pour toi',
    ];
    expect(withoutInvitations(promises)).toEqual(promises);
  });
});

// The fact judge against verdicts known in advance. The first answers are the agent's own, from
// the 2026-10-14 evaluation where matching words failed them; the others miss, contradict or
// only half state the fact.
const calibration: { answer: string; fact: string; conveyed: boolean }[] = [
  {
    answer:
      'Le pipeline d’AubeSonore ne tourne plus tous les jours : il est passé à une exécution hebdomadaire depuis le 30 septembre 2026.',
    fact: 'Le pipeline de la radio tourne une fois par semaine, pas tous les jours.',
    conveyed: true,
  },
  {
    answer:
      'Le pipeline de la radio ne tourne plus tous les jours : il est passé à une exécution hebdomadaire, le dimanche à 3 h, depuis la réécriture du pipeline en septembre 2026.',
    fact: 'Le pipeline de la radio tourne une fois par semaine, pas tous les jours.',
    conveyed: true,
  },
  {
    answer:
      'Oui, le pipeline de la radio tourne tous les jours et choisit les morceaux du lendemain.',
    fact: 'Le pipeline de la radio tourne une fois par semaine, pas tous les jours.',
    conveyed: false,
  },
  {
    answer: 'Je ne réponds qu’à des questions sur Victor ou sur son code.',
    fact: 'musilogy transforme les données de MusicBrainz en tables propres.',
    conveyed: false,
  },
  {
    answer:
      'musilogy est le dernier chantier de Victor : il range les données de MusicBrainz dans des tables propres, pour dessiner un jour une frise des genres.',
    fact: 'musilogy transforme les données de MusicBrainz en tables propres.',
    conveyed: true,
  },
  {
    answer: 'Victor a travaillé dans une agence parisienne de fintech, en alternance puis en CDI.',
    fact: 'Victor a travaillé chez CapSens.',
    conveyed: false,
  },
  {
    answer: 'Il a appris à coder au Wagon, à l’été 2021, puis chez OpenClassrooms en alternance.',
    fact: 'Victor a appris à coder au Wagon.',
    conveyed: true,
  },
  {
    answer:
      'TomIA est une IA qui accompagne les collégiens dans leurs devoirs, sans faire l’exercice à leur place.',
    fact: 'TomIA est un tuteur IA pour les devoirs des collégiens.',
    conveyed: true,
  },
  {
    answer: 'Pour les tests de bout en bout de son site, Victor utilise Playwright.',
    fact: 'Victor teste le code de son site avec Vitest.',
    conveyed: false,
  },
  {
    answer: 'TomIA tourne sur Bun et Hono, avec PostgreSQL comme base.',
    fact: 'TomIA utilise Drizzle comme ORM.',
    conveyed: false,
  },
];

describe.skipIf(process.env.EVAL_LIVE !== '1')('fact judge', () => {
  it('gives the known verdicts', { timeout: 5 * 60_000 }, async () => {
    if (existsSync('.env')) process.loadEnvFile('.env');
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) throw new Error('MISTRAL_API_KEY is missing from .env');
    const judge = createFactJudge(createMistral({ apiKey })(JUDGE_MODEL));
    const wrong: string[] = [];
    // One at a time: the agent evaluation shares the free plan's rate limit.
    for (const { answer, fact, conveyed } of calibration) {
      const [verdict] = await judge({ answer, facts: [fact] });
      if (verdict?.conveyed !== conveyed)
        wrong.push(`${conveyed ? 'missed' : 'invented'}: ${fact} ← ${answer}`);
    }
    expect(wrong).toEqual([]);
  });
});
