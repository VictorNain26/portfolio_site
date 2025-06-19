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
      <div
        className="absolute inset-0 -z-10 bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 to-background/90" />

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="font-display font-extrabold leading-tight drop-shadow-lg text-4xl sm:text-5xl lg:text-6xl"
      >
        <span className="block bg-gradient-to-r from-primary via-fuchsia-500 to-secondary bg-clip-text text-transparent animate-[gradient_8s_ease_infinite]">
          Victor Lenain
        </span>
        <span className="block mt-1 sm:mt-2 text-primary">
          Développeur Full-Stack JavaScript
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
        <Button variant="outline" asChild size="lg" className="flex-1 sm:flex-none">
          <a href="#contact">Contact</a>
        </Button>
      </motion.div>
    </section>
  )
}
