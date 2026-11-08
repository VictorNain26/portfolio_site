---
paths:
  - 'src/lib/agent/**'
  - 'src/pages/api/ask.ts'
  - 'src/content/persona.md'
  - 'evals/**'
---

- L'assistant parle de moi à la troisième personne, pas en mon nom, et n'affirme
  sur moi que ce que disent la fiche, les projets, les articles publiés ou
  GitHub ; un article programmé (`publishedAt` futur) reste hors de sa portée.
- Modèle Mistral : un identifiant daté, pas `-latest`.
- Ses sources se calculent dans le code, pas par le modèle, et c'est le code qui
  lit le README à jour d'un dépôt ou d'un projet que la conversation nomme,
  avant que le modèle réponde.
- `npm run eval` interroge le vrai Mistral (clés dans `.env`, noms dans
  `.env.example`) ; seuils dans `evals/agent.test.ts`. Elle lit le GitHub
  enregistré dans `evals/world.json`, pas celui du jour. `eval.yml` la lance sur
  les PR qui touchent l'agent.
- `npm run eval:record` réenregistre `evals/world.json`, dans sa propre PR :
  `evals/cases.test.ts` signale les faits attendus dont le passage a disparu.
- Un cas d'eval attend des faits, jugés sur le sens, et chacun cite son passage
  ; un juge LLM ne passe en gate qu'avec ses verdicts connus d'avance
  (`evals/judge.test.ts`).
