import Image from "next/image";
import Link from "next/link";
import TagChip from "@/components/TagChip";
import ShareButton from "@/components/ShareButton";

type Post = {
  title: string;
  summary: string;
  coverImage: string;
  publishedAt: string;
  tags: string[];
  slug: string;
  readingTime: number;
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
  return (
    <article className="scroll-mt-28 pt-[calc(3.75rem+env(safe-area-inset-top))]">
      {/* ---------- HERO ---------- */}
      <header className="relative h-56 sm:h-[40vh] w-full overflow-hidden">
        <Image
          src={post.coverImage}
          alt={`${post.title} – couverture`}
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />

        <div className="absolute inset-x-4 bottom-6 mx-auto max-w-4xl text-center drop-shadow-[0_3px_8px_rgba(0,0,0,0.55)]">
          <h1 className="gradient-brand-text font-display text-3xl sm:text-5xl font-extrabold leading-tight">
            {post.title}
          </h1>
          <p className="mt-2 mx-auto max-w-xl text-sm sm:text-base text-indigo-200">
            {post.summary}
          </p>
        </div>
      </header>

      {/* ---------- META ---------- */}
      <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-sm text-gray-400 px-4">
        <time dateTime={post.publishedAt}>
          {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        · <span>{post.readingTime} min</span>
        {post.tags.length > 0 && (
          <>
            ·
            <ul className="flex flex-wrap justify-center gap-2">
              {post.tags.map((t) => (
                <li key={t}>
                  <TagChip tag={t} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* ---------- ACTIONS ---------- */}
      <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center sm:justify-between gap-2 px-4">
        <Link
          href="/blog"
          className="rounded-full border border-indigo-500/50 px-4 py-1.5 text-sm font-medium text-indigo-300 hover:bg-indigo-500/10"
        >
          ← Tous les articles
        </Link>

        <ShareButton title={post.title} summary={post.summary} slug={post.slug} />
      </div>

      {/* ---------- CONTENU ---------- */}
      <section className="prose-sm sm:prose prose-invert lg:prose-lg mx-auto mt-6 max-w-3xl px-4 text-gray-200">
        {children}
      </section>

      {/* ---------- NAVIGATION ---------- */}
      {(prev || next) && (
        <nav className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 px-4 text-sm text-gray-300">
          {prev ? (
            <Link
              href={`/blog/${prev.slug}`}
              className="group flex flex-col rounded-lg border border-white/10 p-3 hover:bg-white/5 transition"
            >
              <span className="text-[11px] uppercase tracking-wide text-gray-400">
                Article précédent
              </span>
              <span className="mt-0.5 font-medium leading-snug text-indigo-300 group-hover:underline">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {next && (
            <Link
              href={`/blog/${next.slug}`}
              className="group flex flex-col rounded-lg border border-white/10 p-3 text-right hover:bg-white/5 transition"
            >
              <span className="text-[11px] uppercase tracking-wide text-gray-400">
                Article suivant
              </span>
              <span className="mt-0.5 font-medium leading-snug text-indigo-300 group-hover:underline">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
