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
    <article className="scroll-mt-28 pt-[calc(3.75rem+env(safe-area-inset-top))] pb-24">
      {/* ---------- BOUTON RETOUR FIXE ---------- */}
      <Link
        aria-label="Retour aux articles"
        className="fixed top-[calc(4rem+env(safe-area-inset-top))] left-4 z-50 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 p-2 shadow transition-transform hover:-translate-y-0.5 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none sm:left-6"
        href="/blog"
      >
        <ArrowLeft className="h-4 w-4 text-white" />
      </Link>

      {/* ---------- HERO ---------- */}
      <header className="relative h-56 w-full overflow-hidden sm:h-[40vh]">
        <Image fill priority alt="" className="object-cover object-center" src={post.coverImage} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />

        {/* Titre + résumé */}
        <div className="absolute inset-x-4 bottom-6 mx-auto max-w-4xl text-center drop-shadow-[0_3px_8px_rgba(0,0,0,0.55)]">
          <h1 className="font-display text-3xl leading-tight font-extrabold text-white sm:text-5xl">
            {post.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-200 sm:text-base">
            {post.summary}
          </p>
        </div>
      </header>

      {/* ---------- MÉTADONNÉES + SHARE ---------- */}
      <div className="mx-auto mt-8 flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 px-4 text-sm">
        <div className="flex items-center gap-4 text-gray-400">
          <time className="whitespace-nowrap" dateTime={post.publishedAt}>
            {date}
          </time>
          <span className="text-gray-500">·</span>
          <span className="whitespace-nowrap">{post.readingTime} min de lecture</span>
        </div>

        <ShareButton slug={post.slug} summary={post.summary} title={post.title} />
      </div>

      {/* ---------- CONTENU ---------- */}
      <section className="prose-sm prose-invert sm:prose lg:prose-lg prose-headings:mb-6 prose-headings:font-display prose-h2:text-white prose-h3:text-gray-100 prose-a:text-indigo-300 prose-a:font-bold prose-a:underline prose-a:decoration-indigo-400 prose-a:decoration-2 prose-a:underline-offset-4 prose-a:transition-all hover:prose-a:text-indigo-200 hover:prose-a:decoration-indigo-300 hover:prose-a:scale-105 prose-strong:text-white prose-ul:pl-5 prose-li:marker:text-indigo-400 prose-hr:border-gray-700 prose-blockquote:border-l-indigo-500 prose-blockquote:text-gray-300 prose-code:text-indigo-300 prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded mx-auto mt-12 max-w-3xl px-4 text-gray-200">
        {children}
      </section>

      {/* ---------- NAVIGATION ---------- */}
      {(prev ?? next) && (
        <nav className="mx-auto mt-20 flex max-w-3xl flex-col gap-4 px-4">
          {prev && (
            <Link
              className="group flex items-center gap-3 rounded-xl border border-gray-700/50 bg-gray-900/60 p-5 transition-all hover:border-gray-600/50 hover:bg-gray-800/60"
              href={`/blog/${prev.slug}`}
            >
              <span className="text-lg text-indigo-400">←</span>
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Article précédent</p>
                <p className="text-sm text-white transition-colors group-hover:text-indigo-300">
                  {prev.title}
                </p>
              </div>
            </Link>
          )}
          {next && (
            <Link
              className="group flex items-center gap-3 self-end rounded-xl border border-gray-700/50 bg-gray-900/60 p-5 transition-all hover:border-gray-600/50 hover:bg-gray-800/60"
              href={`/blog/${next.slug}`}
            >
              <div className="text-right">
                <p className="text-xs tracking-wide text-gray-500 uppercase">Article suivant</p>
                <p className="text-sm text-white transition-colors group-hover:text-indigo-300">
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
