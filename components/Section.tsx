'use client'

import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type Props = HTMLMotionProps<'section'> & { children: ReactNode }

/* marges X uniformes (aucune classe custom) */
export default function Section({ children, className, ...rest }: Props) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.section
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 40 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn('px-4 sm:px-8 lg:px-20', className)}
      {...rest}
    >
      {children}
    </motion.section>
  )
}
