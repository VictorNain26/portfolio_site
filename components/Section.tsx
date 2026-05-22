import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = HTMLAttributes<HTMLElement> & { children: ReactNode };

/**
 * Standard content container with site-wide max-width and horizontal padding.
 * Server Component — reveal animation is handled by `FadeOnView` on inner
 * elements instead of wrapping the whole section.
 */
export default function Section({ children, className, ...rest }: Props) {
  return (
    <section
      className={cn('mx-auto max-w-7xl px-4 sm:px-8 lg:px-20', className)}
      {...rest}
    >
      {children}
    </section>
  );
}
