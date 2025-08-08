# Victor Lenain – Portfolio Dev Web & DevOps

> **Elevator-pitch :** je conçois des applications web modernes (Next 15 / R3F)
> et j’automatise leur déploiement cloud. Démo 👉 <https://victorlenain.fr>

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

## 🎨 Modèles 3D (Hero)

- Fichier: `components/ModelHero.tsx`
- Techs cyclées: React, Next.js, TypeScript, Tailwind, Node.js
- Chaque logo est un modèle procédural (R3F + drei) avec matériaux PBR, ombres de contact et bloom léger.

Ajouter une technologie:
- Ajouter une entrée dans `TECH_MODELS` avec `name`, `type`, `color`.
- Implémenter un composant `XxxLogo` dédié et l’enregistrer dans `TechModel` (switch `model.type`).
- Ajuster l’éclairage si besoin via les `pointLight` conditionnels.
