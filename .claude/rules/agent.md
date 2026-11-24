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
  chaque dépôt `portfolio`) est construit au build depuis `src/data/github.json`
  et tient dans le prompt ; `sync.yml` redéploie quand GitHub change. Ajouter un
  outil ou un RAG se justifie par une mesure de l'eval.
- Ses sources se calculent dans le code, pas par le modèle : un projet est cité
  quand la réponse le nomme.
- `npm run eval` interroge le vrai Mistral (clés dans `.env`, noms dans
  `.env.example`) ; seuils dans `evals/agent.test.ts`. Elle lit le GitHub
  enregistré dans `evals/world.json`, pas celui du jour. `eval.yml` la lance sur
  les PR qui touchent l'agent.
- `npm run eval:record` réenregistre `evals/world.json`, dans sa propre PR :
  `evals/cases.test.ts` signale les faits attendus dont le passage a disparu.
- Un cas d'eval attend des faits, jugés sur le sens, et chacun cite son passage
  ; un juge LLM ne passe en gate qu'avec ses verdicts connus d'avance
  (`evals/judge.test.ts`).
