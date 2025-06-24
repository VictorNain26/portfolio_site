import Image from "next/image";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import { ArrowLeft } from "lucide-react";

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
  prev?: Pick<Post, "title" | "slug"> | null;
  next?: Pick<Post, "title" | "slug"> | null;
  children: React.ReactNode;
}) {
  const date = new Date(post.publishedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article
      className="
        scroll-mt-28
        pt-[calc(3.75rem+env(safe-area-inset-top))]
        pb-24
      "
    >
      {/* ---------- BOUTON RETOUR FIXE ---------- */}
      <Link
        href="/blog"
        aria-label="Retour aux articles"
        className="
          fixed z-50
          left-4 sm:left-6
          top-[calc(4rem+env(safe-area-inset-top))]
          inline-flex items-center justify-center
          rounded-full
          bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600
          p-2 shadow
          transition-transform hover:-translate-y-0.5 hover:brightness-110
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300
        "
      >
        <ArrowLeft className="h-4 w-4 text-white" />
      </Link>

      {/* ---------- HERO ---------- */}
      <header className="relative h-56 sm:h-[40vh] w-full overflow-hidden">
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
          <h1 className="gradient-brand-text font-display text-3xl sm:text-5xl font-extrabold leading-tight">
            {post.title}
          </h1>
          <p className="mt-2 mx-auto max-w-xl text-sm sm:text-base text-indigo-200">
            {post.summary}
          </p>
        </div>
      </header>

      {/* ---------- MÉTADONNÉES + SHARE ---------- */}
      <div
        className="
          mx-auto mt-8 max-w-3xl w-full
          flex flex-wrap items-center justify-between gap-4
          px-4 text-sm text-gray-300
        "
      >
        <span className="whitespace-nowrap">
          {date} · {post.readingTime} min
        </span>

        <ShareButton
          title={post.title}
          summary={post.summary}
          slug={post.slug}
        />
      </div>

      {/* ---------- CONTENU ---------- */}
      <section
        className="
          prose-sm sm:prose prose-invert lg:prose-lg
          mx-auto mt-10 max-w-3xl px-4 text-gray-200
          prose-headings:font-display prose-headings:mb-4
          prose-h2:text-indigo-300 prose-h3:text-indigo-200
          prose-a:text-emerald-400 hover:prose-a:underline
          prose-strong:text-white
          prose-ul:pl-5 prose-li:marker:text-emerald-400
          prose-hr:border-none
        "
      >
        {children}
      </section>

      {/* ---------- NAVIGATION ---------- */}
      {(prev || next) && (
        <nav className="mx-auto mt-16 flex max-w-3xl flex-col gap-4 px-4 text-sm text-gray-300">
          {prev && (
            <Link
              href={`/blog/${prev.slug}`}
              className="group flex items-center gap-3 rounded-lg border border-white/10 p-4 hover:bg-white/5"
            >
              <span className="text-xl">←</span>
              <span className="text-indigo-300 group-hover:underline">
                {prev.title}
              </span>
            </Link>
          )}
          {next && (
            <Link
              href={`/blog/${next.slug}`}
              className="group flex items-center gap-3 self-end rounded-lg border border-white/10 p-4 hover:bg-white/5"
            >
              <span className="text-indigo-300 group-hover:underline">
                {next.title}
              </span>
              <span className="text-xl">→</span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
