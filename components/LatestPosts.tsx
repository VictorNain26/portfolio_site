import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Section from '@/components/Section';
import SectionHeading from '@/components/SectionHeading';
import FadeOnView from '@/components/FadeOnView';

type Post = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
};

export default function LatestPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <Section className="scroll-mt-28 pb-12">
      <SectionHeading
        index="05"
        label="Blog"
        title="Je partage ce que j'apprends."
        aside={
          <Link
            className="hidden items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-brand-accent sm:inline-flex"
            href="/blog"
          >
            Voir tout
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post, index) => (
          <FadeOnView key={post.slug} as="article" delay={0.05 + index * 0.06}>
            <Link
              className="group block h-full rounded-2xl border border-line-2 bg-surface-1 p-6 backdrop-blur-sm transition-all duration-300 hover:border-brand-hover/20 hover:bg-surface-3"
              href={`/blog/${post.slug}`}
            >
              <time
                className="font-mono text-xs font-medium text-gray-500"
                dateTime={post.publishedAt}
              >
                {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
              <h3 className="mt-3 text-base leading-snug font-semibold text-white transition-colors group-hover:text-brand-light">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-400">
                {post.summary}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent opacity-0 transition-opacity group-hover:opacity-100">
                Lire
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </span>
            </Link>
          </FadeOnView>
        ))}
      </div>

      <FadeOnView className="mt-8 text-center sm:hidden" delay={0.3}>
        <Link
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-brand-accent"
          href="/blog"
        >
          Voir tous les articles
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </FadeOnView>
    </Section>
  );
}
