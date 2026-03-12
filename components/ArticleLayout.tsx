import Link from 'next/link';
import ShareButton from '@/components/ShareButton';
import { ArrowLeft } from 'lucide-react';

type Post = {
  title: string;
  summary: string;
  publishedAt: string;
  readingTime: number;
  slug: string;
  tags?: string[];
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
    <article className="mx-auto max-w-3xl px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      {/* ---------- NAVIGATION ---------- */}
      <nav className="mb-10">
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
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          {post.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
          <time dateTime={post.publishedAt}>{date}</time>
          <span aria-hidden="true" className="text-gray-700">/</span>
          <span>{post.readingTime} min de lecture</span>
        </div>

        <p className="mt-6 text-lg leading-relaxed text-gray-300">
          {post.summary}
        </p>

        {/* Separator */}
        <div className="mt-10 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      </header>

      {/* ---------- CONTENU ---------- */}
      <section className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-14 prose-h2:text-2xl prose-h2:text-white prose-h3:mt-10 prose-h3:text-xl prose-h3:text-gray-100 prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:marker:text-indigo-400 prose-hr:border-gray-800 prose-blockquote:border-l-indigo-500 prose-blockquote:text-gray-400 prose-blockquote:not-italic prose-code:text-indigo-300 prose-code:bg-gray-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
        {children}
      </section>

      {/* ---------- SHARE ---------- */}
      <div className="mt-14 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 py-4">
        <span className="text-sm text-gray-400">Partager cet article</span>
        <ShareButton slug={post.slug} summary={post.summary} title={post.title} />
      </div>

      {/* ---------- AUTEUR ---------- */}
      <aside className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm sm:p-8">
        <div className="flex items-start gap-4 sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
            VL
          </div>
          <div>
            <p className="font-semibold text-white">Victor Lenain</p>
            <p className="mt-0.5 text-sm leading-relaxed text-gray-400">
              Développeur Full-Stack freelance. React, Next.js, Node.js, TypeScript.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/20"
            href="https://www.linkedin.com/in/victor-lenain/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Suivre sur LinkedIn
          </a>
          <a
            className="inline-flex items-center self-center text-sm text-gray-500 transition-colors hover:text-gray-300"
            href="https://github.com/victornain26"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </aside>

      {/* ---------- NAVIGATION ARTICLES ---------- */}
      {(prev ?? next) && (
        <nav className="mt-10 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.04]"
              href={`/blog/${prev.slug}`}
            >
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                <span aria-hidden="true">← </span>Précédent
              </p>
              <p className="mt-2 text-sm font-medium leading-snug text-white transition-colors group-hover:text-indigo-400">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-right transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.04]"
              href={`/blog/${next.slug}`}
            >
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Suivant<span aria-hidden="true"> →</span>
              </p>
              <p className="mt-2 text-sm font-medium leading-snug text-white transition-colors group-hover:text-indigo-400">
                {next.title}
              </p>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
