import { allPosts } from 'content-collections';
import { notFound } from 'next/navigation';
import MDX from '@/components/MDX';
import ArticleLayout from '@/components/ArticleLayout';
import BlogPostJsonLd from '@/app/components/BlogPostJsonLd';

const BASE_URL = 'https://victorlenain.fr';

/* ---------------- Params statiques ---------------- */
// Ne pré-rendre que les articles déjà publiés.
// Les articles futurs ne sont PAS générés au build (évite les 404 en cache).
// dynamicParams = true (défaut) : un article futur est rendu à la demande
// quand on accède à son URL, sans créer de 404 persistant.
export function generateStaticParams() {
  const now = new Date();
  return allPosts
    .filter((p) => new Date(p.publishedAt) <= now)
    .map((p) => ({ slug: p.slug }));
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
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
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

  const code = post.mdx as unknown as string;
  if (code.length === 0) {
    notFound();
  }

  // Navigation entre tous les articles publiés (exclut les futurs de la nav)
  const now = new Date();
  const published = allPosts
    .filter((p) => new Date(p.publishedAt) <= now)
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
  const idx = published.findIndex((p) => p.slug === post.slug);
  const prev = idx > 0 ? (published[idx - 1] ?? null) : null;
  const next = idx >= 0 && idx < published.length - 1 ? (published[idx + 1] ?? null) : null;

  const words = post.content.split(/\s+/);
  const WORDS_PER_MINUTE = 200;
  const readingTime = Math.ceil(words.length / WORDS_PER_MINUTE);
  const article = { ...post, readingTime, tags: post.tags };

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
