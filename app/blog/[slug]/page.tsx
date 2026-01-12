import { allPosts } from 'content-collections';
import { notFound } from 'next/navigation';
import MDX from '@/components/MDX';
import ArticleLayout from '@/components/ArticleLayout';

const BASE_URL = 'https://victorlenain.fr';

/* ---------------- Params statiques ---------------- */
export function generateStaticParams() {
  return allPosts.map(p => ({ slug: p.slug }));
}

/* ---------------- SEO / OG ------------------------ */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = allPosts.find(p => p.slug === slug);
  if (!post) {
    return {};
  }

  const url = `${BASE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: ['Victor Lenain'],
      // Images are generated dynamically by opengraph-image.tsx
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      // Images are generated dynamically by opengraph-image.tsx
    },
  };
}

/* ---------------- Page article -------------------- */
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = allPosts.find(p => p.slug === slug);
  if (!post) {
    notFound();
  }

  const idx = allPosts.indexOf(post);
  const prev = allPosts[idx - 1] ?? null;
  const next = allPosts[idx + 1] ?? null;

  const WORDS_PER_MINUTE = 200;
  const readingTime = Math.ceil(post.content.split(/\s+/).length / WORDS_PER_MINUTE);
  const article = { ...post, readingTime };

  const code = post.mdx as unknown as string;
  if (code.length === 0) {
    notFound();
  }

  return (
    <ArticleLayout next={next} post={article} prev={prev}>
      <MDX code={code} />
    </ArticleLayout>
  );
}
