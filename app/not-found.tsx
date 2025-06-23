// app/not-found.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-hero-gradient px-6">

      <div className="relative z-10 w-full max-w-5xl text-center">
        <h1
          className="text-5xl font-extrabold tracking-tight drop-shadow-lg sm:text-6xl lg:text-7xl"
          style={{ color: "var(--hero-title-color)" }}
        >
          404 – Page introuvable
        </h1>

        {/* PARAGRAPHE : blanc très léger + ombre pour lisibilité */}
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/90 drop-shadow-sm sm:text-xl">
          Désolé&nbsp;! Cette page n’existe pas (ou plus).
          Cliquez ci-dessous pour revenir à l’accueil.
        </p>

        {/* BOUTON : fond et bordure = couleur hero ; texte blanc */}
        <Button
          asChild
          size="lg"
          className="mt-8 font-semibold shadow-md hover:opacity-90"
          style={{
            backgroundColor: "var(--hero-title-color)",
            borderColor: "var(--hero-title-color)",
            color: "#ffffff",
          }}
        >
          <Link href="/" prefetch>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour à l’accueil
          </Link>
        </Button>
      </div>
    </main>
  );
}
