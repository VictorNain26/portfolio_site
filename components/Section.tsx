'use client'

import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type Props = HTMLMotionProps<'section'> & { children: ReactNode }

export default function Section({ children, className, ...rest }: Props) {
  const prefersReducedMotion = useReducedMotion()

  const MotionSection = motion.section

  return (
    <MotionSection
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 40 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </MotionSection>
  )
}
