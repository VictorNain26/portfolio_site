'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ThreeHero = dynamic(() => import('@/components/ThreeHero'), {
  ssr: false,
  loading: () => null,
})

export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative h-screen w-full flex flex-col items-center justify-center text-center px-6 md:px-10 overflow-hidden"
    >
      <div className="absolute inset-0 -z-20 bg-fixed bg-center bg-cover bg-[url('/images/hero-bg.jpg')]" />

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="font-display font-extrabold leading-tight text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)] text-4xl sm:text-5xl lg:text-6xl"
      >
        Victor&nbsp;Lenain
        <br />
        <span className="text-white/90 text-2xl sm:text-3xl lg:text-4xl">
          Développeur&nbsp;Full-Stack&nbsp;JavaScript
        </span>
      </motion.h1>

      <div className="w-full max-w-lg h-72 sm:h-80 md:h-96 mt-8 sm:mt-10">
        <ThreeHero />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none sm:justify-center"
      >
        <Button asChild size="lg" className="flex-1 sm:flex-none">
          <a href="#projets">
            Projets <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>

        <Button
          variant="secondary"
          asChild
          size="lg"
          className="flex-1 sm:flex-none"
        >
          <a href="#contact">Contact</a>
        </Button>
      </motion.div>
    </section>
  )
}
