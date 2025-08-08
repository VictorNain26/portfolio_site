# Victor Lenain – Portfolio Dev Web & DevOps

> **Elevator-pitch :** développeur web full‑stack curieux, calme et raisonné,
> je conçois des applications web modernes (Next 15 / R3F) intégrant des
> solutions d'intelligence artificielle et j’automatise leur déploiement
> cloud. Démo 👉 <https://victorlenain.fr>

![screencast](docs/assets/screen.gif)

|                          |                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| **Stack principale**     | Next.js 15 (App Router), Tailwind CSS 4, shadcn/ui, Framer Motion, React-three-fiber, Hugging Face Inference. |
| **Fonctionnalités clés** | 3 D Hero (génération Shap-E), scroll animé Radix/UI, formulaire de contact mailto.                            |

## 🚀 Démarrage rapide

```bash
# 1. Cloner
git clone https://github.com/<you>/victornain26-portfolio_site.git
cd victornain26-portfolio_site

# 2. Installer
bun install    # bun.lockb doit être commit-safe

# 3. Init UI
bunx shadcn init

# 4. Variables d’env.
cp .env.example .env.local   # puis renseigner HF_TOKEN

# 5. Dev
bun run dev
```

## CI/CD

- `master` : branche de production protégée, déployée automatiquement sur l'environnement live. Toutes les modifications doivent passer par des Pull Requests.
- `staging` : branche de préproduction. Chaque `push` déclenche les tests, le lint et un déploiement vers l'environnement de préproduction via GitHub Actions.
- branches de fonctionnalité : fusionner dans `staging` pour vérification avant la mise en production.
