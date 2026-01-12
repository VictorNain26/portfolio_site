import { allPosts } from 'content-collections';
import Link from 'next/link';

export const metadata = {
  title: 'Blog',
  description:
    'Articles sur le développement web, React, Next.js et les bonnes pratiques du code moderne.',
  openGraph: {
    title: 'Blog | Victor Lenain',
    description: 'Articles sur le développement web et les bonnes pratiques.',
    type: 'website',
    url: 'https://victorlenain.fr/blog',
  },
  twitter: {
    title: 'Blog | Victor Lenain',
    description: 'Articles sur le développement web et les bonnes pratiques.',
  },
  alternates: {
    canonical: 'https://victorlenain.fr/blog',
  },
};

export default function BlogIndex() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-24 pb-24 sm:px-6">
      {/* Header */}
      <header className="mb-16">
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Blog
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Réflexions sur le développement web et le code.
        </p>
      </header>

      {/* Liste des articles */}
      <div className="space-y-12">
        {allPosts.map(post => (
          <article key={post.slug}>
            <Link className="group block" href={`/blog/${post.slug}`}>
              <time className="text-sm text-gray-500" dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>

              <h2 className="mt-2 text-xl font-semibold text-white transition-colors group-hover:text-indigo-400 sm:text-2xl">
                {post.title}
              </h2>

              <p className="mt-3 leading-relaxed text-gray-400">{post.summary}</p>

              <span className="mt-4 inline-flex items-center text-sm font-medium text-indigo-400 transition-colors group-hover:text-indigo-300">
                Lire l&apos;article
                <svg
                  className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </span>
            </Link>
          </article>
        ))}
      </div>

      {allPosts.length === 0 && (
        <p className="text-center text-gray-500">Aucun article pour le moment.</p>
      )}
    </main>
  );
}
