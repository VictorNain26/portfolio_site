import { allPosts } from 'content-collections';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';

export const metadata = {
  title: 'Blog Technique',
  description: 'Articles techniques sur Next.js 15, React 19, DevOps et intelligence artificielle appliquée au développement web. Guides pratiques et retours d\'expérience par Victor Lenain.',
  keywords: [
    'blog technique',
    'Next.js 15',
    'React 19',
    'DevOps',
    'Intelligence artificielle',
    'Développement web',
    'Tutoriels JavaScript',
    'TypeScript',
    'Articles techniques',
    'Guides pratiques'
  ],
  openGraph: {
    title: 'Blog Technique | Victor Lenain',
    description: 'Articles techniques sur Next.js 15, React 19, DevOps et IA. Guides pratiques et retours d\'expérience.',
    type: 'website',
    url: 'https://victorlenain.fr/blog',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Blog Technique Victor Lenain',
      }
    ],
  },
  twitter: {
    title: 'Blog Technique | Victor Lenain',
    description: 'Articles techniques sur Next.js 15, React 19, DevOps et IA.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://victorlenain.fr/blog',
  },
};

export default function BlogIndex() {
  const blogStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog Technique Victor Lenain',
    description: 'Articles techniques sur Next.js 15, React 19, DevOps et intelligence artificielle',
    url: 'https://victorlenain.fr/blog',
    inLanguage: 'fr-FR',
    author: {
      '@type': 'Person',
      name: 'Victor Lenain',
      url: 'https://victorlenain.fr'
    },
    publisher: {
      '@type': 'Person',
      name: 'Victor Lenain'
    },
    blogPost: allPosts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.summary,
      url: `https://victorlenain.fr/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      author: {
        '@type': 'Person',
        name: 'Victor Lenain'
      },
      publisher: {
        '@type': 'Person',
        name: 'Victor Lenain'
      },
      image: `https://victorlenain.fr${post.coverImage}`,
      keywords: post.tags,
      articleSection: 'Technologie',
      inLanguage: 'fr-FR'
    }))
  };

  return (
    <>
      <Script
        id="blog-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData),
        }}
      />
      
      <main className="mx-auto max-w-5xl scroll-mt-28 px-4 pt-24">
      <header className="mb-10 text-center">
        <h1 className="font-display text-4xl font-extrabold leading-tight gradient-brand-text sm:text-6xl">
          Le&nbsp;blog
        </h1>
        <p className="mt-2 text-indigo-200">
          Articles sur Next&nbsp;15, React&nbsp;19, DevOps et IA appliquée.
        </p>
      </header>

      <ul className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {allPosts.map(post => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900/60 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div className="relative h-48">
                <Image
                  src={post.coverImage}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
              </div>

              <div className="p-6">
                <h2 className="mb-3 font-display text-xl font-semibold text-white leading-tight">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">{post.summary}</p>
                
                <div className="mt-4 flex items-center text-xs text-gray-400">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      </main>
    </>
  );
}
