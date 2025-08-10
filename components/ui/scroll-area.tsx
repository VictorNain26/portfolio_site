'use client';

import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '@/lib/utils';

export function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      className={cn('relative overflow-hidden', className)}
      id="scroll-viewport"
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>

      {/* ------------- vertical rail ------------- */}
      <ScrollAreaPrimitive.Scrollbar
        className="/* par défaut */ invisible absolute top-0 right-0 flex h-full w-2.5 -translate-x-2.5 touch-none p-px opacity-0 transition-all select-none hover:translate-x-0 hover:opacity-100 data-[state=visible]:translate-x-0 data-[state=visible]:opacity-100"
        orientation="vertical"
      >
        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-gradient-to-b from-indigo-500 to-violet-400 hover:from-indigo-400 hover:to-violet-300" />
      </ScrollAreaPrimitive.Scrollbar>

      {/* ------------- horizontal rail (facultatif) ------------- */}
      <ScrollAreaPrimitive.Scrollbar
        className="absolute bottom-0 left-0 flex h-2.5 w-full translate-y-2.5 touch-none p-px opacity-0 transition-all select-none hover:translate-y-0 hover:opacity-100 data-[state=visible]:translate-y-0 data-[state=visible]:opacity-100"
        orientation="horizontal"
      >
        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-400 hover:from-indigo-400 hover:to-violet-300" />
      </ScrollAreaPrimitive.Scrollbar>

      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
