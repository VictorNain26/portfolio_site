import Image from 'next/image';
import Link from 'next/link';
import ShareButton from '@/components/ShareButton';
import { ArrowLeft } from 'lucide-react';

type Post = {
  title: string;
  summary: string;
  coverImage: string;
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
  prev?: Pick<Post, 'title' | 'slug'> | null;
  next?: Pick<Post, 'title' | 'slug'> | null;
  children: React.ReactNode;
}) {
  const date = new Date(post.publishedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="scroll-mt-28 pb-24 pt-[calc(3.75rem+env(safe-area-inset-top))]">
      {/* ---------- BOUTON RETOUR FIXE ---------- */}
      <Link
        href="/blog"
        aria-label="Retour aux articles"
        className="fixed left-4 top-[calc(4rem+env(safe-area-inset-top))] z-50 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 p-2 shadow transition-transform hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:left-6"
      >
        <ArrowLeft className="h-4 w-4 text-white" />
      </Link>

      {/* ---------- HERO ---------- */}
      <header className="relative h-56 w-full overflow-hidden sm:h-[40vh]">
        <Image
          src={post.coverImage}
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />

        {/* Titre + résumé */}
        <div className="absolute inset-x-4 bottom-6 mx-auto max-w-4xl text-center drop-shadow-[0_3px_8px_rgba(0,0,0,0.55)]">
          <h1 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            {post.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-200 sm:text-base leading-relaxed">
            {post.summary}
          </p>
        </div>
      </header>

      {/* ---------- MÉTADONNÉES + SHARE ---------- */}
      <div className="mx-auto mt-8 flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 px-4 text-sm">
        <div className="flex items-center gap-4 text-gray-400">
          <time dateTime={post.publishedAt} className="whitespace-nowrap">
            {date}
          </time>
          <span className="text-gray-500">·</span>
          <span className="whitespace-nowrap">
            {post.readingTime} min de lecture
          </span>
        </div>

        <ShareButton
          title={post.title}
          summary={post.summary}
          slug={post.slug}
        />
      </div>

      {/* ---------- CONTENU ---------- */}
      <section className="prose-sm prose-invert mx-auto mt-12 max-w-3xl px-4 text-gray-200 sm:prose lg:prose-lg prose-headings:mb-6 prose-headings:font-display prose-h2:text-white prose-h3:text-gray-100 prose-a:text-indigo-300 prose-a:font-bold prose-a:underline prose-a:decoration-indigo-400 prose-a:decoration-2 prose-a:underline-offset-4 prose-a:transition-all hover:prose-a:text-indigo-200 hover:prose-a:decoration-indigo-300 hover:prose-a:scale-105 prose-strong:text-white prose-ul:pl-5 prose-li:marker:text-indigo-400 prose-hr:border-gray-700 prose-blockquote:border-l-indigo-500 prose-blockquote:text-gray-300 prose-code:text-indigo-300 prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
        {children}
      </section>

      {/* ---------- NAVIGATION ---------- */}
      {(prev || next) && (
        <nav className="mx-auto mt-20 flex max-w-3xl flex-col gap-4 px-4">
          {prev && (
            <Link
              href={`/blog/${prev.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-gray-700/50 bg-gray-900/60 p-5 transition-all hover:bg-gray-800/60 hover:border-gray-600/50"
            >
              <span className="text-lg text-indigo-400">←</span>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Article précédent</p>
                <p className="text-sm text-white group-hover:text-indigo-300 transition-colors">
                  {prev.title}
                </p>
              </div>
            </Link>
          )}
          {next && (
            <Link
              href={`/blog/${next.slug}`}
              className="group flex items-center gap-3 self-end rounded-xl border border-gray-700/50 bg-gray-900/60 p-5 transition-all hover:bg-gray-800/60 hover:border-gray-600/50"
            >
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Article suivant</p>
                <p className="text-sm text-white group-hover:text-indigo-300 transition-colors">
                  {next.title}
                </p>
              </div>
              <span className="text-lg text-indigo-400">→</span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
