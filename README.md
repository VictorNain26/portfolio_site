# Portfolio Dev Web & DevOps

## Démarrage rapide

```bash
bun create next-app mon-portfolio
# Copie ensuite les fichiers de ce repo ou clone-le
bun install
bunx shadcn init
bun run dev
```

## Principales dépendances

- Next.js 15 (App Router)
- Tailwind CSS 4
- shadcn/ui (Radix + Tailwind)
- Framer Motion
- Lucide React
- three / @react-three/fiber / @react-three/drei

## 3D Hero

Le composant **Hero** intègre un cube en rotation rendu avec Three.js. Il est
chargé dynamiquement pour éviter les problèmes de SSR de Next.js.

## Déployer sur Vercel

Connecte ton repo GitHub → Import Project → voilà.

