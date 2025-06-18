import { clsx } from 'clsx'

export function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | 'secondary'
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        variant === 'default'
          ? 'bg-primary text-primary-foreground'
          : 'bg-gray-800 text-gray-300'
      )}
    >
      {children}
    </span>
  )
}
