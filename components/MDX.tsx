import { useMDXComponent } from '@content-collections/mdx/react';
import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import NextLink from 'next/link';

const DEFAULT_IMAGE_WIDTH = 800;
const DEFAULT_IMAGE_HEIGHT = 450;

const components: MDXComponents = {
  /* -------- images fluides -------- */
  img: rawProps => {
    const {
      src,
      alt = '',
      width,
      height,
      className,
      ...rest
    } = rawProps as React.ImgHTMLAttributes<HTMLImageElement> & {
      src: string;
      width?: number | string;
      height?: number | string;
    };

    const w = typeof width === 'number' || typeof width === 'string' ? Number(width) : DEFAULT_IMAGE_WIDTH;
    const h = typeof height === 'number' || typeof height === 'string' ? Number(height) : DEFAULT_IMAGE_HEIGHT;

    return (
      <figure className="my-8">
        <Image
          alt={alt}
          className={cn('rounded-lg border border-white/[0.06]', className)}
          height={h}
          src={src}
          width={w}
          {...rest}
        />
        {alt !== '' && (
          <figcaption className="mt-3 text-center text-sm text-gray-400 italic">{alt}</figcaption>
        )}
      </figure>
    );
  },

  /* -------- tableaux responsive -------- */
  table: ({ children }) => (
    <div className="my-8 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[480px] border-collapse overflow-hidden rounded-xl border border-white/[0.08] text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-white/[0.04]">{children}</thead>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-white/[0.06] last:border-b-0">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:px-6">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3.5 text-sm text-gray-300 sm:px-6">{children}</td>
  ),

  /* -------- citations -------- */
  blockquote: ({ children }) => (
    <blockquote className="my-8 rounded-r-xl border-l-4 border-indigo-500/60 bg-white/[0.02] py-4 pl-6 pr-4">
      <div className="text-gray-300 italic">{children}</div>
    </blockquote>
  ),

  /* -------- listes -------- */
  ul: ({ children }) => <ul className="my-6 space-y-2 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="my-6 space-y-2 pl-6">{children}</ol>,
  li: ({ children }) => <li className="text-gray-300 marker:text-indigo-400">{children}</li>,

  /* -------- séparateurs -------- */
  hr: () => (
    <hr className="my-12 h-px border-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
  ),

  /* -------- paragraphes -------- */
  p: ({ children }) => <p className="my-4 leading-relaxed text-gray-300">{children}</p>,

  /* -------- titres ancrables -------- */
  h2: ({ children }) => (
    <h2
      className="font-display mt-16 mb-6 scroll-mt-28 text-2xl font-bold tracking-tight text-white"
      id={String(children).toLowerCase().replace(/\s+/g, '-')}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      className="mt-12 mb-4 scroll-mt-28 text-xl font-semibold text-gray-100"
      id={String(children).toLowerCase().replace(/\s+/g, '-')}
    >
      {children}
    </h3>
  ),
  Link: NextLink,
  Badge,

  /* -------- liens personnalisés -------- */
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <NextLink
      className="text-indigo-300 underline decoration-indigo-400/60 decoration-1 underline-offset-4 transition-colors hover:text-indigo-200 hover:decoration-indigo-300"
      href={href ?? '#'}
    >
      {children}
    </NextLink>
  ),

  /* -------- code blocks -------- */
  pre: ({ children }) => (
    <pre className="my-8 overflow-x-auto rounded-xl border border-white/[0.06] bg-gray-900/60 p-6 text-sm">
      {children}
    </pre>
  ),
  code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const isInline = className === undefined;
    if (isInline) {
      return (
        <code className="rounded bg-gray-800/60 px-1.5 py-0.5 text-sm text-indigo-300">
          {children}
        </code>
      );
    }
    return <code className={className}>{children}</code>;
  },
};

/**
 * MDX renderer using @content-collections/mdx
 * The useMDXComponent hook returns a memoized component internally
 */
/* eslint-disable react-hooks/static-components -- library pattern for MDX */
export default function MDX({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
/* eslint-enable react-hooks/static-components */
