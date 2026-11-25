---
paths:
  - 'src/lib/agent/**'
  - 'src/pages/api/ask.ts'
  - 'src/content/persona.md'
  - 'evals/**'
---

- L'assistant parle de moi à la troisième personne, pas en mon nom, et n'affirme
  sur moi que ce que disent la fiche, les projets ou GitHub.
- Modèle Mistral : un identifiant daté, pas `-latest`.
- Un seul appel au modèle, sans outils : le corpus (la fiche, puis le README de
  chaque dépôt `portfolio`, passé en texte par `strip-markdown` au build) vient
  de `src/data/github.json` et tient dans le prompt ; `sync.yml` redéploie quand
  GitHub change. Ajouter un outil ou un RAG se justifie par une mesure de
  l'eval.
- Le protocole est celui de l'AI SDK : flux de messages UI côté serveur,
  `useChat` côté page. La page n'envoie que la nouvelle question et l'id du chat
  ; le serveur garde la conversation (`UIMessage[]`, Upstash) et génère les ids.
- Une question acceptée compte, même si sa réponse échoue : Upstash ne documente
  aucun remboursement. Un bot (BotID) est refusé avant le quota. La modération
  passe par le SDK Mistral.
- Ses sources se calculent dans le code, pas par le modèle : un projet est cité
  quand la réponse le nomme, puis quand la question ou un tour précédent le
  nomme.
- Le corpus a un budget (`MAX_CORPUS`, `src/lib/agent/knowledge.ts`) : le build
  échoue au-delà.
- `npm run eval` interroge le vrai Mistral (clés dans `.env`, noms dans
  `.env.example`) ; seuils dans `evals/agent.test.ts`. Une réponse plantée ou un
  juge en échec arrête la run comme panne d'infrastructure, pas comme une note.
  Elle lit le GitHub enregistré dans `evals/world.json`, pas celui du jour.
  `eval.yml` la lance sur les PR qui touchent l'agent.
- `npm run eval:record` réenregistre `evals/world.json`, dans sa propre PR :
  `evals/cases.test.ts` signale les faits attendus dont le passage a disparu.
- Un cas d'eval attend des faits, jugés sur le sens, et chacun cite son passage
  ; un juge LLM ne passe en gate qu'avec ses verdicts connus d'avance
  (`evals/judge.test.ts`).
