'use client';

import { motion, type HTMLMotionProps, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

// Animation constants for mobile performance optimization
const ANIMATION_DURATION = 0.4;
const BEZIER_START = 0.25;
const BEZIER_MID_LOW = 0.1;
const BEZIER_MID_HIGH = 0.25;
const BEZIER_END = 1;
const BEZIER_CURVE = [BEZIER_START, BEZIER_MID_LOW, BEZIER_MID_HIGH, BEZIER_END] as const;
const ENTRANCE_DELAY = 0.1;

type Props = HTMLMotionProps<'section'> & { children: ReactNode };

export default function Section({ children, className, ...rest }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className={cn('mx-auto max-w-7xl px-4 sm:px-8 lg:px-20', className)}
      // Reduced movement for mobile performance
      initial={reduced ? false : { opacity: 0, y: 20 }}
      // Earlier trigger to improve perceived performance
      viewport={{ once: true, amount: 0.15, margin: '-50px' }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      transition={{ 
        // Faster transition for better mobile performance
        duration: reduced ? 0 : ANIMATION_DURATION,
        // Smoother easing curve for better feel
        ease: BEZIER_CURVE,
        // Slight delay to prevent flash during load
        delay: ENTRANCE_DELAY
      }}
      {...rest}
    >
      {children}
    </motion.section>
  );
}
