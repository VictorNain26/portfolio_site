import { allPosts } from "content-collections";
import { notFound } from "next/navigation";
import MDX from "@/components/MDX";
import ArticleLayout from "@/components/ArticleLayout";

/* ---------------- Params statiques ---------------- */
export async function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

/* ---------------- SEO / OG ------------------------ */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: { images: [post.coverImage] },
  };
}

/* ---------------- Page article -------------------- */
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const idx = allPosts.indexOf(post);
  const prev = allPosts[idx - 1] ?? null;
  const next = allPosts[idx + 1] ?? null;

  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200);
  const article = { ...post, readingTime };

  const code = (post as any).mdx as string;
  if (!code) notFound();

  return (
    <ArticleLayout post={article} prev={prev} next={next}>
      <MDX code={code} />
    </ArticleLayout>
  );
}
