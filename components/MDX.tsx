import { useMDXComponent } from '@content-collections/mdx/react';
import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import NextLink from 'next/link';

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
      width?: string | number;
      height?: string | number;
    };

    const w = width ? Number(width) : 800;
    const h = height ? Number(height) : 450;

    return (
      <figure className="my-8">
        <Image
          src={src}
          alt={alt}
          width={w}
          height={h}
          className={cn('rounded-lg border border-gray-700/50', className)}
          {...rest}
        />
        {alt && (
          <figcaption className="mt-3 text-center text-sm text-gray-400 italic">{alt}</figcaption>
        )}
      </figure>
    );
  },

  /* -------- tableaux -------- */
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto">
      <table className="min-w-full overflow-hidden rounded-lg border border-gray-700/50">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-800/60">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-gray-700/50 px-6 py-3 text-left text-sm font-semibold text-gray-200">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-gray-700/30 px-6 py-4 text-sm text-gray-300">{children}</td>
  ),

  /* -------- citations -------- */
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-4 border-indigo-500/60 py-4 pl-6">
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
      id={String(children).toLowerCase().replace(/\s+/g, '-')}
      className="font-display mt-16 mb-6 scroll-mt-28 text-2xl font-bold text-white"
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      id={String(children).toLowerCase().replace(/\s+/g, '-')}
      className="mt-12 mb-4 scroll-mt-28 text-xl font-semibold text-gray-100"
    >
      {children}
    </h3>
  ),
  Link: NextLink,
  Badge,

  /* -------- liens personnalisés -------- */
  a: ({ href, children }) => (
    <NextLink
      href={href || '#'}
      className="text-indigo-300 underline decoration-indigo-400/60 decoration-1 underline-offset-4 transition-colors hover:text-indigo-200 hover:decoration-indigo-300"
    >
      {children}
    </NextLink>
  ),

  /* -------- code blocks -------- */
  pre: ({ children }) => (
    <pre className="my-8 overflow-x-auto rounded-lg border border-gray-700/50 bg-gray-900/60 p-6">
      {children}
    </pre>
  ),
  code: ({ children, className }) => {
    const isInline = !className;
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

export default function MDX({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
