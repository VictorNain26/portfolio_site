'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '@/lib/utils';

/** Wrapper plein écran avec custom scrollbar + reset auto */
export default function ScrollView({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  /* Référence sur le viewport pour pouvoir scroller */
  const viewportRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  /* À chaque navigation, on remonte en haut */
  useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <ScrollAreaPrimitive.Root
      type="always"
      className={cn('relative h-[100dvh] w-full overflow-hidden', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        id="scroll-viewport"
        className="h-full w-full rounded-[inherit]"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>

      {/* Rail vertical */}
      <ScrollAreaPrimitive.Scrollbar
        orientation="vertical"
        className="absolute right-0 top-0 h-full w-2.5 p-px"
      >
        <ScrollAreaPrimitive.Thumb className="flex-1 rounded-full bg-gradient-to-b from-indigo-500 to-violet-400" />
      </ScrollAreaPrimitive.Scrollbar>

      {/* Rail horizontal (facultatif) */}
      <ScrollAreaPrimitive.Scrollbar
        orientation="horizontal"
        className="absolute bottom-0 left-0 h-2.5 w-full p-px"
      >
        <ScrollAreaPrimitive.Thumb className="flex-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-400" />
      </ScrollAreaPrimitive.Scrollbar>

      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
