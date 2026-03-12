import { allPosts } from 'content-collections';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Projects from '@/components/Projects';
import FAQ from '@/components/FAQ';
import LatestPosts from '@/components/LatestPosts';
import Contact from '@/components/Contact';

export default function Home() {
  const now = new Date();
  const latestPosts = allPosts
    .filter((post) => new Date(post.publishedAt) <= now)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      publishedAt: post.publishedAt,
    }));

  return (
    <main className="space-y-16 sm:space-y-24 lg:space-y-32" id="main">
      <Hero />
      <Services />
      <Process />
      <Projects />
      <FAQ />
      <LatestPosts posts={latestPosts} />
      <Contact />
    </main>
  );
}
