'use client';

import { motion, type HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

type Props = HTMLMotionProps<'section'> & { children: ReactNode };

export default function Section({ children, className, ...rest }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 40 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn('mx-auto max-w-7xl px-4 sm:px-8 lg:px-20', className)}
      {...rest}
    >
      {children}
    </motion.section>
  );
}
