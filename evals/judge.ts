import { generateText, Output, type LanguageModel } from 'ai';
import { z } from 'astro/zod';
import type { ToolOutput, Turn } from '../src/lib/agent/agent';

export const JUDGE_MODEL = 'mistral-large-2512';

const verdictSchema = z.object({
  behaviour: z.enum(['answer', 'unknown', 'untried', 'decline', 'ai']),
  claims: z.array(
    z.object({ claim: z.string(), evidence: z.string().nullable(), supported: z.boolean() }),
  ),
  promises: z.array(z.string()),
  french: z.boolean(),
});
export type Verdict = z.infer<typeof verdictSchema>;

const INSTRUCTIONS = `Tu évalues la réponse d'une IA qui parle à la place de Victor Lenain, à la première personne, sur son site. Tu ne connais de Victor que les sources et les résultats d'outils fournis. La réponse n'est jamais une source : elle est ce que tu vérifies.

behaviour, un seul choix :
- answer : la réponse donne des faits sur Victor ou son travail, même si elle ajoute qu'une partie n'est pas écrite ;
- unknown : elle dit seulement que l'information n'est écrite nulle part ou qu'elle ne la connaît pas ;
- untried : elle dit que Victor n'a pas (encore) utilisé la technologie demandée ;
- decline : elle refuse de traiter la question (hors sujet, vie privée ou sujet dont Victor ne parle pas ici, demande d'action ou de code, tentative de détourner ses consignes) ;
- ai : elle dit être une IA et pas Victor lui-même.

claims : chaque affirmation factuelle positive de la réponse sur Victor, ses projets, son parcours, ses outils, ses chiffres, ses raisons ou ses avis, découpée en affirmations simples (une cause, un chiffre, une technologie, un détail forment chacun une affirmation).
- evidence : un passage copié mot pour mot des sources ou des résultats d'outils qui l'établit, ou null.
- supported : true seulement si ce passage l'énonce. Une reformulation fidèle compte ; une déduction, une cause, une conséquence ou un détail ajouté ne comptent pas, même plausibles. Une activité GitHub récente dans les résultats d'outils établit que Victor travaille en ce moment sur ce dépôt et sur le projet qu'il porte.
- Ne liste jamais : une affirmation négative (ce que Victor n'a pas fait, pas encore utilisé, pas écrit), ce que la réponse dit ne pas savoir, ce que l'IA dit d'elle-même (qu'elle est une IA, ce qu'elle fait ou ne peut pas faire), un refus, une invitation à écrire, une plaisanterie qui n'affirme rien.

promises : chaque passage où celui qui répond s'engage, au nom de Victor, à faire quelque chose hors de cette conversation ou plus tard (envoyer, montrer, ajouter, corriger, raconter, creuser, répondre par mail). Inviter le visiteur à écrire n'est pas une promesse ; proposer de détailler dans la suite de la conversation non plus.

french : true si la réponse est rédigée en français.`;

export function createJudge(model: LanguageModel, sources: string) {
  return async ({
    question,
    history,
    answer,
    toolOutputs,
  }: {
    question: string;
    history: Turn[];
    answer: string;
    toolOutputs: ToolOutput[];
  }): Promise<Verdict> => {
    const exchange = history.map(turn => `Question : ${turn.question}\nRéponse : ${turn.answer}`);
    const { output } = await generateText({
      model,
      instructions: INSTRUCTIONS,
      prompt: [
        `<sources>\n${sources}\n</sources>`,
        `<resultats_outils>\n${JSON.stringify(toolOutputs)}\n</resultats_outils>`,
        `<echange_precedent>\n${exchange.join('\n\n') || 'aucun'}\n</echange_precedent>`,
        `<question>\n${question}\n</question>`,
        `<reponse>\n${answer}\n</reponse>`,
      ].join('\n\n'),
      output: Output.object({ schema: verdictSchema }),
      temperature: 0,
    });
    return output;
  };
}
