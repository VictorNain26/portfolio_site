import { allPosts } from 'content-collections';
import Link from 'next/link';
import Image from 'next/image';
import TagChip from '@/components/TagChip';

export const metadata = { title: 'Blog – Victor Lenain' };

export default function BlogIndex() {
  return (
    <main className="mx-auto max-w-5xl scroll-mt-28 px-4 pt-24">
      <header className="mb-10 text-center">
        <h1 className="font-display text-4xl font-extrabold leading-tight gradient-brand-text sm:text-6xl">
          Le&nbsp;blog
        </h1>
        <p className="mt-2 text-indigo-200">
          Articles sur Next&nbsp;15, React&nbsp;19, DevOps et IA appliquée.
        </p>
      </header>

      <ul className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {allPosts.map(post => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900/60 shadow-lg transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="relative h-48">
                <Image
                  src={post.coverImage}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
              </div>

              <div className="p-5">
                <h2 className="mb-1 font-display text-xl font-semibold text-indigo-300">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-300">{post.summary}</p>

                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map(t => (
                      <TagChip key={t} tag={t} />
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
