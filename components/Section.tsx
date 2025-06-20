'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

type MotionSectionProps = React.ComponentPropsWithoutRef<'section'>

interface Props extends MotionSectionProps {
  children: ReactNode
}

export default function Section({
  children,
  className = '',
  ...rest               /* ← id, style, data-*, etc. */
}: Props) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.section
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 40 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
      {...rest}          /* ← propage id, className, etc. */
    >
      {children}
    </motion.section>
  )
}
