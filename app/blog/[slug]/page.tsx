import { allPosts } from 'content-collections';
import { notFound } from 'next/navigation';
import MDX from '@/components/MDX';
import ArticleLayout from '@/components/ArticleLayout';
import BlogPostJsonLd from '@/app/components/BlogPostJsonLd';

// Régénérer toutes les heures pour publier les articles programmés
export const revalidate = 3600;

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
    keywords: post.tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: ['Victor Lenain'],
      tags: post.tags,
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
  if (!post || new Date(post.publishedAt) > new Date()) {
    notFound();
  }

  // Navigation uniquement entre articles publiés
  const published = allPosts
    .filter((p) => new Date(p.publishedAt) <= new Date())
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
  const idx = published.indexOf(post);
  const prev = published[idx - 1] ?? null;
  const next = published[idx + 1] ?? null;

  const words = post.content.split(/\s+/);
  const WORDS_PER_MINUTE = 200;
  const readingTime = Math.ceil(words.length / WORDS_PER_MINUTE);
  const article = { ...post, readingTime };

  const code = post.mdx as unknown as string;
  if (code.length === 0) {
    notFound();
  }

  return (
    <>
      <BlogPostJsonLd
        publishedAt={post.publishedAt}
        slug={post.slug}
        summary={post.summary}
        tags={post.tags}
        title={post.title}
        wordCount={words.length}
      />
      <ArticleLayout next={next} post={article} prev={prev}>
        <MDX code={code} />
      </ArticleLayout>
    </>
  );
}
