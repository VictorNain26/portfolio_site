import { cn } from '@/lib/utils';
import * as React from 'react';

export function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      className={cn('text-primary animate-spin', className)}
      data-slot="spinner"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" />
    </svg>
  );
}
