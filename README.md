# Portfolio Dev Web & DevOps

## Démarrage rapide

```bash
pnpm create next-app@latest mon-portfolio
# ou yarn create next-app, npm create next-app
# Copie ensuite les fichiers de ce repo ou clone-le
pnpm i
pnpm dlx shadcn@latest init
pnpm dev
```

## Principales dépendances

- Next.js 15 (App Router)
- Tailwind CSS 4
- shadcn/ui (Radix + Tailwind)
- Framer Motion
- Lucide React

## Déployer sur Vercel

Connecte ton repo GitHub → Import Project → voilà.

## Docker

Une image de développement peut être créée avec `docker-compose build`. Le fichier
`.dockerignore` exclut les dossiers inutiles (node_modules, logs, etc.) afin de
réduire le contexte envoyé au daemon Docker et d'accélérer la phase de build.
