import { allPosts } from 'content-collections';
import Link from 'next/link';

const blogBreadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Accueil',
      item: 'https://victorlenain.fr',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: 'https://victorlenain.fr/blog',
    },
  ],
};

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

export const revalidate = 3600; // Re-generate every hour so scheduled posts appear on time

const WORDS_PER_MINUTE = 200;
const BASE_URL = 'https://victorlenain.fr';

export default function BlogIndex() {
  const now = new Date();
  const publishedPosts = allPosts
    .filter((post) => new Date(post.publishedAt) <= now)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Blog Victor Lenain',
    description: 'Articles sur le développement web et les bonnes pratiques.',
    numberOfItems: publishedPosts.length,
    itemListElement: publishedPosts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${BASE_URL}/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogBreadcrumbJsonLd) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        type="application/ld+json"
      />

      {/* Header */}
      <header className="mb-14">
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Blog
        </h1>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-gray-400">
          Réflexions sur le développement web, le freelancing et les bonnes pratiques du code.
        </p>
      </header>

      {/* Articles */}
      <div className="space-y-6">
        {publishedPosts.map((post) => {
          const readingTime = Math.ceil(
            post.content.split(/\s+/).length / WORDS_PER_MINUTE
          );

          return (
            <article key={post.slug}>
              <Link
                className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.04] sm:p-8"
                href={`/blog/${post.slug}`}
              >
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                  <span aria-hidden="true" className="text-gray-700">
                    /
                  </span>
                  <span>{readingTime} min de lecture</span>
                </div>

                {/* Title */}
                <h2 className="mt-3 text-xl font-semibold leading-snug text-white transition-colors group-hover:text-indigo-400 sm:text-2xl">
                  {post.title}
                </h2>

                {/* Summary */}
                <p className="mt-3 line-clamp-2 leading-relaxed text-gray-400">
                  {post.summary}
                </p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-medium text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <span className="mt-5 inline-flex items-center text-sm font-medium text-indigo-400 transition-colors group-hover:text-indigo-300">
                  Lire l&apos;article
                  <svg
                    aria-hidden="true"
                    className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1"
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
          );
        })}
      </div>

      {publishedPosts.length === 0 && (
        <p className="text-center text-gray-500">Aucun article pour le moment.</p>
      )}
    </main>
  );
}
