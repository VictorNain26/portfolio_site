import { ScrollArea } from '@/components/ui/scroll-area'
import { ReactNode } from 'react'

export default function ScrollView({ children }: { children: ReactNode }) {
  return (
    <ScrollArea
      type="hover"          /* disparaît hors scroll/hover */
      scrollHideDelay={400}
      className="h-[100dvh] w-full"
    >
      {children}
    </ScrollArea>
  )
}
