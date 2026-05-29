'use client';

import { Share2 } from 'lucide-react';
import { useCallback } from 'react';

export default function ShareButton({
  title,
  summary,
  slug,
}: {
  title: string;
  summary: string;
  slug: string;
}) {
  const share = useCallback(async () => {
    const url = `${window.location.origin}/blog/${slug}`;

    if ('share' in navigator) {
      try {
        await navigator.share({ title, text: summary, url });
        return;
      } catch {
        // Share failed silently
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      // Lien copié dans le presse-papier
    } catch {
      // Erreur silencieuse lors du partage
    }
  }, [title, summary, slug]);

  return (
    <button
      aria-label="Partager l’article"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-hover/30 bg-brand-hover/10 transition-colors hover:bg-brand-hover/20 focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none"
      onClick={() => {
        void share();
      }}
    >
      <Share2 className="h-4 w-4 text-white" />
    </button>
  );
}
