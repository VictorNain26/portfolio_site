import { clsx } from 'clsx'
import { ReactNode } from 'react'

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx('bg-gray-800/50 border border-gray-700 rounded-2xl shadow', className)}>{children}</div>
}

export function CardContent({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx('p-4', className)}>{children}</div>
}
