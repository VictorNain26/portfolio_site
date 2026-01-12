import Link from 'next/link';
import ShareButton from '@/components/ShareButton';
import { ArrowLeft } from 'lucide-react';

type Post = {
  title: string;
  summary: string;
  publishedAt: string;
  readingTime: number;
  slug: string;
};

export default function ArticleLayout({
  post,
  prev,
  next,
  children,
}: {
  post: Post;
  prev?: Pick<Post, 'slug' | 'title'> | null;
  next?: Pick<Post, 'slug' | 'title'> | null;
  children: React.ReactNode;
}) {
  const date = new Date(post.publishedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="mx-auto max-w-2xl px-4 pt-24 pb-24 sm:px-6">
      {/* ---------- NAVIGATION ---------- */}
      <nav className="mb-12">
        <Link
          className="group inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          href="/blog"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Retour aux articles
        </Link>
      </nav>

      {/* ---------- HEADER ---------- */}
      <header className="mb-12">
        <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
          <time dateTime={post.publishedAt}>{date}</time>
          <span>·</span>
          <span>{post.readingTime} min de lecture</span>
        </div>

        <p className="mt-6 text-lg leading-relaxed text-gray-300">
          {post.summary}
        </p>
      </header>

      {/* ---------- CONTENU ---------- */}
      <section className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:mt-12 prose-h2:text-2xl prose-h2:text-white prose-h3:mt-8 prose-h3:text-xl prose-h3:text-gray-100 prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:marker:text-indigo-400 prose-hr:border-gray-800 prose-blockquote:border-l-indigo-500 prose-blockquote:text-gray-400 prose-blockquote:not-italic prose-code:text-indigo-300 prose-code:bg-gray-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
        {children}
      </section>

      {/* ---------- SHARE ---------- */}
      <div className="mt-16 flex items-center justify-between border-t border-gray-800 pt-8">
        <span className="text-sm text-gray-500">Partager cet article</span>
        <ShareButton slug={post.slug} summary={post.summary} title={post.title} />
      </div>

      {/* ---------- NAVIGATION ARTICLES ---------- */}
      {(prev ?? next) && (
        <nav className="mt-12 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link
              className="group rounded-lg border border-gray-800 p-4 transition-colors hover:border-gray-700 hover:bg-gray-900/50"
              href={`/blog/${prev.slug}`}
            >
              <p className="text-xs text-gray-500 uppercase">← Précédent</p>
              <p className="mt-1 text-sm font-medium text-white transition-colors group-hover:text-indigo-400">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link
              className="group rounded-lg border border-gray-800 p-4 text-right transition-colors hover:border-gray-700 hover:bg-gray-900/50"
              href={`/blog/${next.slug}`}
            >
              <p className="text-xs text-gray-500 uppercase">Suivant →</p>
              <p className="mt-1 text-sm font-medium text-white transition-colors group-hover:text-indigo-400">
                {next.title}
              </p>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
