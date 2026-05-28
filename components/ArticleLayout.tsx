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
            {post.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full border border-brand-hover/20 bg-brand-hover/10 px-3 py-1 text-xs font-medium text-brand-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-display text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          {post.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
          <time dateTime={post.publishedAt}>{date}</time>
          <span aria-hidden="true" className="text-gray-700">
            /
          </span>
          <span>{post.readingTime} min de lecture</span>
        </div>

        <p className="mt-6 text-lg leading-relaxed text-gray-300">{post.summary}</p>

        {/* Separator */}
        <div className="mt-10 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      </header>

      {/* ---------- CONTENU ---------- */}
      {/* Le contenu est stylé par les composants MDX custom (cf. MDX.tsx) ;
       * `.prose` (globals.css) ne fournit que la base (couleur de texte,
       * fallback titres). Pas de plugin @tailwindcss/typography nécessaire. */}
      <section className="prose max-w-none">{children}</section>

      {/* ---------- SHARE ---------- */}
      <div className="mt-14 flex items-center justify-between rounded-xl border border-line-2 bg-surface-1 px-6 py-4">
        <span className="text-sm text-gray-400">Partager cet article</span>
        <ShareButton slug={post.slug} summary={post.summary} title={post.title} />
      </div>

      {/* ---------- AUTEUR ---------- */}
      <aside className="mt-8 rounded-2xl border border-line-2 bg-surface-1 p-6 backdrop-blur-sm sm:p-8">
        <div className="flex items-start gap-4 sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-hover to-purple-600 text-sm font-bold text-white">
            VL
          </div>
          <div>
            <p className="font-semibold text-white">Victor Lenain</p>
            <p className="mt-0.5 text-sm leading-relaxed text-gray-400">
              Développeur full-stack freelance · Intégration IA · Paris. Je greffe la couche IA sur
              votre stack web existante.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-hover/30 bg-brand-hover/10 px-4 py-1.5 text-sm font-medium text-brand-accent transition-colors hover:bg-brand-hover/20"
            href="https://www.linkedin.com/in/victorlenain/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Suivre sur LinkedIn
          </a>
          <a
            className="inline-flex items-center self-center text-sm text-gray-500 transition-colors hover:text-gray-300"
            href="https://github.com/VictorNain26"
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
              className="group rounded-2xl border border-line-2 bg-surface-1 p-5 transition-all duration-300 hover:border-brand-hover/30 hover:bg-surface-3"
              href={`/blog/${prev.slug}`}
            >
              <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                <span aria-hidden="true">← </span>Précédent
              </p>
              <p className="mt-2 text-sm leading-snug font-medium text-white transition-colors group-hover:text-brand-accent">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link
              className="group rounded-2xl border border-line-2 bg-surface-1 p-5 text-right transition-all duration-300 hover:border-brand-hover/30 hover:bg-surface-3"
              href={`/blog/${next.slug}`}
            >
              <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                Suivant<span aria-hidden="true"> →</span>
              </p>
              <p className="mt-2 text-sm leading-snug font-medium text-white transition-colors group-hover:text-brand-accent">
                {next.title}
              </p>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
