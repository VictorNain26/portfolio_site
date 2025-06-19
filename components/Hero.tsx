'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ThreeHero = dynamic(() => import('@/components/ThreeHero'), {
  ssr: false,
  loading: () => null,
})

export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative h-screen w-full overflow-hidden px-6 md:px-12"
    >
      {/* background */}
      <div className="absolute inset-0 -z-20 bg-fixed bg-center bg-cover bg-[url('/images/hero-bg.jpg')]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 to-black/70" />

      {/* grid */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col md:grid md:grid-cols-2 md:items-center">
        {/* text + CTA */}
        <div className="flex flex-col items-center md:items-start justify-center gap-8">
          <motion.header
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-md">
              Victor&nbsp;Lenain
            </h1>
            <p className="mt-2 text-lg sm:text-xl text-white/90">
              Développeur&nbsp;Full-Stack&nbsp;JavaScript
            </p>
          </motion.header>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none sm:justify-start"
          >
            {/* Projets – plein violet, ombre/ring violet */}
            <Button
              asChild
              size="lg"
              className="flex-1 sm:flex-none bg-primary text-white shadow-md shadow-primary/40
                         hover:bg-primary/90 focus-visible:ring-4 focus-visible:ring-primary/40"
            >
              <a href="#projets">
                Projets <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>

            {/* Contact – plein vert, ombre/ring vert */}
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="flex-1 sm:flex-none shadow-md shadow-secondary/40
                         hover:bg-secondary/90 focus-visible:ring-4 focus-visible:ring-secondary/40"
            >
              <a href="#contact">Contact</a>
            </Button>
          </motion.div>
        </div>

        {/* 3D */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="h-72 sm:h-80 md:h-[32rem] mt-10 md:mt-0"
        >
          <ThreeHero />
        </motion.div>
      </div>

      {/* scroll hint */}
      <a
        href="#a-propos"
        aria-label="Faire défiler vers À propos"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 animate-bounce"
      >
        <ChevronDown className="h-7 w-7" />
      </a>
    </section>
  )
}
