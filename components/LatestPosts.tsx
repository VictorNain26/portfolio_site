'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Section from '@/components/Section';

type Post = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
};

export default function LatestPosts({ posts }: { posts: Post[] }) {
  const reduced = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 } as const,
          whileInView: { opacity: 1, y: 0 } as const,
          viewport: { once: true } as const,
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  if (posts.length === 0) return null;

  return (
    <Section className="scroll-mt-28 pb-12">
      <div className="mb-10 flex items-end justify-between">
        <motion.h2
          {...fadeUp(0)}
          className="font-display text-3xl font-bold text-white sm:text-4xl"
        >
          Derniers <span className="hero-gradient-text">articles</span>
        </motion.h2>
        <motion.div {...fadeUp(0.1)}>
          <Link
            className="hidden items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-indigo-400 sm:inline-flex"
            href="/blog"
          >
            Voir tout
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post, index) => (
          <motion.article
            key={post.slug}
            {...fadeUp(0.1 + index * 0.1)}
          >
            <Link
              className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/20 hover:bg-white/[0.04]"
              href={`/blog/${post.slug}`}
            >
              <time className="text-xs font-medium text-gray-500" dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
              <h3 className="mt-3 text-base font-semibold leading-snug text-white group-hover:text-indigo-300 transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-400">
                {post.summary}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
                Lire
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </span>
            </Link>
          </motion.article>
        ))}
      </div>

      {/* Mobile "see all" link */}
      <motion.div {...fadeUp(0.4)} className="mt-8 text-center sm:hidden">
        <Link
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-indigo-400"
          href="/blog"
        >
          Voir tous les articles
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </motion.div>
    </Section>
  );
}
