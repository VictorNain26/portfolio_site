import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ReactNode } from 'react'

export default function ScrollView({ children }: { children: ReactNode }) {
  return (
    <ScrollArea
      type="hover"                         /* disparaît hors hover/scroll */
      className="h-full w-full"
      scrollHideDelay={500}               /* ms avant disparition */
    >
      {children}
      <ScrollBar
        className="
          bg-transparent
          [&_[data-orientation=vertical]_>div]:
            bg-gradient-to-b from-indigo-500/60 to-fuchsia-500/60
            rounded-full
        "
      />
    </ScrollArea>
  )
}
