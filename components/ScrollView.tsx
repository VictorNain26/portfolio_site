'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '@/lib/utils';

/**
 * Plein-écran scroll wrapper.
 *
 * Décisions UI :
 *  - `type="scroll"` : la scrollbar n'apparaît qu'au moment du scroll, puis
 *    s'estompe. Pattern dominant 2026 (Linear, Vercel, Stripe). Zéro
 *    distraction visuelle pendant la lecture.
 *  - Scrollbar scopée SOUS le header (h-14 mobile, h-16 desktop). Elle ne
 *    traverse plus la zone du header translucide, qui restait illisible
 *    derrière la barre dégradée.
 */
export default function ScrollView({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <ScrollAreaPrimitive.Root
      className={cn('relative h-[100dvh] w-full overflow-hidden', className)}
      scrollHideDelay={600}
      type="scroll"
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        className="h-full w-full rounded-[inherit]"
        id="scroll-viewport"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>

      {/* Rail vertical : commence sous le header pour ne pas le traverser */}
      <ScrollAreaPrimitive.Scrollbar
        className="absolute top-14 right-0 h-[calc(100%-3.5rem)] w-2 p-px transition-opacity data-[state=hidden]:opacity-0 lg:top-16 lg:h-[calc(100%-4rem)]"
        orientation="vertical"
      >
        <ScrollAreaPrimitive.Thumb className="flex-1 rounded-full bg-gradient-to-b from-indigo-500/80 to-violet-400/80" />
      </ScrollAreaPrimitive.Scrollbar>

      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
