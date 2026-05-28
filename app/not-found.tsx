// app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-content-center justify-items-center gap-8 px-4 text-center">
      {/* Titre – gradient identique au Hero */}
      <h1 className="bg-gradient-to-br from-[#818cf8] via-[#6366f1] to-[#4f46e5] bg-clip-text font-display text-5xl leading-snug font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
        404&nbsp;·&nbsp;Page introuvable
      </h1>

      <p className="max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
        Oups&nbsp;! Cette page n’existe pas ou a été déplacée. Utilisez le bouton ci-dessous pour
        revenir à l’accueil.
      </p>

      {/* Bouton : même gradient que le titre, pas de déplacement au hover */}
      <Button
        asChild
        className="justify-self-center rounded-md bg-gradient-to-br from-[#818cf8] via-[#6366f1] to-[#4f46e5] px-8 py-3 font-semibold text-white shadow-lg ring-1 ring-white/10 ring-inset hover:brightness-110 focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:outline-none"
        size="lg"
      >
        <Link href="/">Retour à l’accueil</Link>
      </Button>
    </main>
  );
}
