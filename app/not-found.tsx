// app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-content-center justify-items-center gap-8 px-4 text-center">
      {/* Titre – gradient identique au Hero */}
      <h1 className="font-display bg-gradient-to-br from-[#6bb4d8] via-[#4288b7] to-[#2d5e81] bg-clip-text text-5xl leading-snug font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
        404&nbsp;·&nbsp;Page introuvable
      </h1>

      <p className="max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
        Oups&nbsp;! Cette page n’existe pas ou a été déplacée. Utilisez le bouton ci-dessous pour
        revenir à l’accueil.
      </p>

      {/* Bouton : même gradient que le titre, pas de déplacement au hover */}
      <Button
        asChild
        size="lg"
        className="justify-self-center rounded-md bg-gradient-to-br from-[#6bb4d8] via-[#4288b7] to-[#2d5e81] px-8 py-3 font-semibold text-white shadow-lg ring-1 ring-white/10 ring-inset hover:brightness-110 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Link href="/">Retour à l’accueil</Link>
      </Button>
    </main>
  );
}
