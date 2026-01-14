'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Error boundary for route segments (not root layout).
 * - Must be a Client Component
 * - Errors bubble up to the nearest parent error boundary
 * - Use useEffect to log errors to monitoring services
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service (Sentry, LogRocket, etc.)
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-content-center justify-items-center gap-8 px-4 text-center">
      <h1 className="font-display bg-gradient-to-br from-[#6bb4d8] via-[#4288b7] to-[#2d5e81] bg-clip-text text-5xl leading-snug font-extrabold tracking-tight text-transparent sm:text-6xl">
        Erreur technique
      </h1>

      <p className="max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
        Une erreur inattendue s&apos;est produite. Veuillez réessayer ou revenir
        à l&apos;accueil.
      </p>

      <div className="flex gap-4">
        <Button
          className="rounded-md bg-gradient-to-br from-[#6bb4d8] via-[#4288b7] to-[#2d5e81] px-8 py-3 font-semibold text-white shadow-lg ring-1 ring-white/10 ring-inset hover:brightness-110 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:outline-none"
          size="lg"
          type="button"
          onClick={() => reset()}
        >
          Réessayer
        </Button>
        <Button
          asChild
          className="rounded-md border border-gray-600 bg-transparent px-8 py-3 font-semibold text-gray-300 hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:outline-none"
          size="lg"
          variant="outline"
        >
          <Link href="/">Accueil</Link>
        </Button>
      </div>
    </main>
  );
}
