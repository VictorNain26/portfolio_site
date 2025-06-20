'use client'

import { motion, HTMLMotionProps, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'

type Props = HTMLMotionProps<'section'>

export default function Section({
  children,
  className,
  ...rest
}: Props) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.section
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 40 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={clsx(className)}
      {...rest}          {/* id, onClick, etc. */}
    >
      {children}
    </motion.section>
  )
}
