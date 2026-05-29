'use client';

import { type CSSProperties, type ElementType, type ReactNode, type Ref } from 'react';
import { useFadeOnView } from '@/hooks/useFadeOnView';
import { cn } from '@/lib/utils';

type FadeOnViewProps = {
  /** Tag rendered. Defaults to `div`. */
  as?: ElementType;
  /** Delay in seconds before the fade-up starts. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  id?: string;
};

/**
 * Thin wrapper around `useFadeOnView` for the common case: reveal a block
 * with a fade-up when it enters the viewport. Use the hook directly when
 * you need finer control (multiple staggered children inside one parent).
 */
export default function FadeOnView({
  as,
  delay = 0,
  className,
  style,
  children,
  id,
}: FadeOnViewProps) {
  const Tag = (as ?? 'div') as ElementType;
  const { ref, visible } = useFadeOnView<HTMLElement>();

  return (
    <Tag
      ref={ref as Ref<HTMLElement>}
      className={cn('fade-on-view', visible && 'is-visible', className)}
      id={id}
      style={{ ...style, '--fade-delay': `${delay}s` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
