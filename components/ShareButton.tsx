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

    if (navigator.share) {
      try {
        await navigator.share({ title, text: summary, url });
        return;
      } catch {
        // Share failed silently
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      alert('Lien copié !');
    } catch {
      alert('Impossible de partager ce lien.');
    }
  }, [title, summary, slug]);

  return (
    <button
      aria-label="Partager l’article"
      onClick={share}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 shadow-lg transition-transform hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
    >
      <Share2 className="h-4 w-4 text-white" />
    </button>
  );
}
