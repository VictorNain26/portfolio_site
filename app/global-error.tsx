'use client';

import { useEffect } from 'react';

/**
 * GlobalError handles errors in the root layout.
 * - Must be a Client Component
 * - Must include its own <html> and <body> tags (replaces root layout when active)
 * - Less common than nested error boundaries
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service (Sentry, LogRocket, etc.)
    console.error('GlobalError:', error);
  }, [error]);

  return (
    <html lang="fr">
      <head>
        <title>Erreur | Victor Lenain</title>
        <meta
          content="Une erreur technique s'est produite. Veuillez réessayer."
          name="description"
        />
        <meta content="noindex" name="robots" />
      </head>
      <body className="bg-[#0e082e] font-sans antialiased">
        <main className="grid min-h-screen place-content-center justify-items-center gap-8 px-4 text-center">
          <h1 className="bg-gradient-to-br from-[#6bb4d8] via-[#4288b7] to-[#2d5e81] bg-clip-text text-5xl leading-snug font-extrabold tracking-tight text-transparent sm:text-6xl">
            Erreur technique
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
            Une erreur inattendue s&apos;est produite. Veuillez réessayer ou
            revenir à l&apos;accueil.
          </p>

          <div className="flex gap-4">
            <button
              className="rounded-md bg-gradient-to-br from-[#6bb4d8] via-[#4288b7] to-[#2d5e81] px-8 py-3 font-semibold text-white shadow-lg ring-1 ring-white/10 ring-inset hover:brightness-110 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:outline-none"
              type="button"
              onClick={() => reset()}
            >
              Réessayer
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error replaces root layout, Link unavailable */}
            <a
              className="rounded-md border border-gray-600 px-8 py-3 font-semibold text-gray-300 hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:outline-none"
              href="/"
            >
              Accueil
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
