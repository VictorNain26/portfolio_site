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
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        className={cn('my-6 rounded-xl', className)}
        {...rest}
      />
    );
  },

  /* -------- titres ancrables -------- */
  h2: ({ children }) => (
    <h2
      id={String(children).toLowerCase().replace(/\s+/g, '-')}
      className="mt-14 scroll-mt-28 font-display text-2xl font-bold text-indigo-300"
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      id={String(children).toLowerCase().replace(/\s+/g, '-')}
      className="mt-10 scroll-mt-28 text-xl font-semibold text-indigo-200"
    >
      {children}
    </h3>
  ),
  Link: NextLink,
  Badge,
};

export default function MDX({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
