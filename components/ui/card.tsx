import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('bg-gray-800/50 border border-gray-700 rounded-2xl shadow', className)}>{children}</div>
}

export function CardContent({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('p-4', className)}>{children}</div>
}
