"use client";

import { Share2 } from "lucide-react";

export default function ShareButton({
  title,
  summary,
  slug,
}: {
  title: string;
  summary: string;
  slug: string;
}) {
  const share = () => {
    const url = `${location.origin}/blog/${slug}`;

    if (navigator.share) {
      navigator.share({ title, text: summary, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Lien copié !");
    }
  };

  return (
    <button
      onClick={share}
      className="
        inline-flex items-center gap-2 rounded-full
        bg-indigo-600 px-5 py-2 text-sm font-medium text-white
        shadow-lg transition hover:bg-indigo-500
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300
      "
    >
      <Share2 className="h-4 w-4" />
      Partager
    </button>
  );
}
