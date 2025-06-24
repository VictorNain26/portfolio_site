// components/ui/scroll-area.tsx (complètement réécrit)
"use client"

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"
import * as React from "react"

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

      {/* ─────────── Vertical rail ─────────── */}
      <ScrollAreaPrimitive.Scrollbar
        orientation="vertical"
        className={cn(
          // rail
          "flex touch-none select-none transition-all p-px",
          // rail masquée par défaut
          "w-0 data-[state=visible]:w-2.5 hover:w-2.5",
          // position
          "absolute right-0 top-0 h-full",
        )}
      >
        {/* thumb */}
        <ScrollAreaPrimitive.Thumb
          className="relative flex-1 rounded-full
                     bg-gradient-to-b from-indigo-500 to-violet-400
                     hover:from-indigo-400 hover:to-violet-300"
        />
      </ScrollAreaPrimitive.Scrollbar>

      {/* ─────────── Horizontal rail (optionnel) ─────────── */}
      <ScrollAreaPrimitive.Scrollbar
        orientation="horizontal"
        className={cn(
          "flex touch-none select-none transition-all p-px",
          "h-0 data-[state=visible]:h-2.5 hover:h-2.5",
          "absolute bottom-0 left-0 w-full flex-col",
        )}
      >
        <ScrollAreaPrimitive.Thumb
          className="relative flex-1 rounded-full
                     bg-gradient-to-r from-indigo-500 to-violet-400
                     hover:from-indigo-400 hover:to-violet-300"
        />
      </ScrollAreaPrimitive.Scrollbar>

      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}
