// app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-content-center justify-items-center gap-8 px-4 text-center">
      {/* Titre – gradient identique au Hero */}
      <h1
        className="
          font-display font-extrabold tracking-tight
          text-transparent bg-clip-text
          bg-gradient-to-br from-[#6bb4d8] via-[#4288b7] to-[#2d5e81]
          text-5xl sm:text-6xl lg:text-7xl leading-snug
        "
      >
        404&nbsp;·&nbsp;Page introuvable
      </h1>

      <p className="max-w-xl text-base sm:text-lg leading-relaxed text-gray-300">
        Oups&nbsp;! Cette page n’existe pas ou a été déplacée.
        Utilisez le bouton ci-dessous pour revenir à l’accueil.
      </p>

      {/* Bouton : même gradient que le titre, pas de déplacement au hover */}
      <Button
        asChild
        size="lg"
        className="
          justify-self-center
          bg-gradient-to-br from-[#6bb4d8] via-[#4288b7] to-[#2d5e81]
          hover:brightness-110
          text-white
          rounded-md px-8 py-3 font-semibold shadow-lg
          ring-1 ring-inset ring-white/10
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-300
        "
      >
        <Link href="/">Retour à l’accueil</Link>
      </Button>
    </main>
  );
}
