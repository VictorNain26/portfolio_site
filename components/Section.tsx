"use client"

import { motion, HTMLMotionProps, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

type Props = HTMLMotionProps<"section"> & { children: ReactNode }

export default function Section({ children, className, ...rest }: Props) {
  const reduced = useReducedMotion()

  return (
    <motion.section
      initial={reduced ? undefined : { opacity: 0, y: 40 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("mx-auto max-w-7xl px-4 sm:px-8 lg:px-20", className)}
      {...rest}
    >
      {children}
    </motion.section>
  )
}
