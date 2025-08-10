import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/** Bouton circulaire pour icônes sociales (GitHub, LinkedIn, etc.) */
const iconButtonVariants = cva(
  'group rounded-full border border-black/10 bg-black/5 shadow-sm \
   transition-colors duration-200 hover:bg-black/20 hover:border-black/20 \
   dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/30 dark:hover:border-white/30 \
   text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 \
   [&_svg]:pointer-events-none',
  {
    variants: {
      size: {
        sm: 'p-2 [&_svg]:h-4 [&_svg]:w-4',
        md: 'p-2.5 sm:p-3 [&_svg]:h-5 [&_svg]:w-5',
        lg: 'p-3 sm:p-4 [&_svg]:h-6 [&_svg]:w-6',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

type Props = React.ComponentPropsWithoutRef<'a'> &
  VariantProps<typeof iconButtonVariants> & { asChild?: boolean };

export function SocialIconButton({ asChild, size, className, ...props }: Props) {
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      className={cn(iconButtonVariants({ size }), className)}
      data-slot="social-icon-button"
      {...props}
    />
  );
}

export { iconButtonVariants };
