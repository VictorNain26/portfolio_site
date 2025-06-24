"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"

export function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>

      {/* vertical rail */}
      <ScrollAreaPrimitive.Scrollbar
        orientation="vertical"
        className="
          absolute right-0 top-0 h-full flex select-none touch-none p-px
          w-0 hover:w-2.5 data-[state=visible]:w-2.5       /* ↔ élargissement */
          transition-all
        "
      >
        <ScrollAreaPrimitive.Thumb
          className="
            relative flex-1 rounded-full
            bg-gradient-to-b from-indigo-500 to-violet-400
            hover:from-indigo-400 hover:to-violet-300
          "
        />
      </ScrollAreaPrimitive.Scrollbar>

      {/* horizontal rail (facultatif) */}
      <ScrollAreaPrimitive.Scrollbar
        orientation="horizontal"
        className="
          absolute bottom-0 left-0 w-full flex-col select-none touch-none p-px
          h-0 hover:h-2.5 data-[state=visible]:h-2.5
          transition-all
        "
      >
        <ScrollAreaPrimitive.Thumb
          className="
            relative flex-1 rounded-full
            bg-gradient-to-r from-indigo-500 to-violet-400
            hover:from-indigo-400 hover:to-violet-300
          "
        />
      </ScrollAreaPrimitive.Scrollbar>

      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}
