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
      /* `min-height: 100svh` prend en compte la barre d’URL mobile */
      style={{ minHeight: '100svh' }}
      className="relative isolate flex flex-col items-center justify-between overflow-hidden pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0"
    >
      {/* ---------- arrière-plan ---------- */}
      <div
        role="img"
        aria-label="Fond futuriste représentant une grille 3D néon"
        className="absolute inset-0 -z-20 bg-[url('/images/hero-bg.jpg')] bg-cover bg-fixed bg-center"
      />
      {/* dégradé : plus opaque sur mobile pour la lisibilité */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/40 to-black/80 md:bg-gradient-to-r md:from-black/70 md:via-black/50 md:to-transparent" />

      {/* ---------- contenu ---------- */}
      <div className="container mx-auto grid max-w-7xl flex-1 items-center gap-10 px-6 md:grid-cols-2 lg:gap-16">
        {/* --- bloc texte & CTA --- */}
        <div className="flex flex-col items-center gap-8 md:items-start">
          <motion.header
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center md:text-left"
          >
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight text-white">
              Victor&nbsp;Lenain
            </h1>
            <p className="mt-3 max-w-xs text-base sm:text-lg md:text-xl text-white/90 md:max-w-none">
              Développeur&nbsp;Full-Stack&nbsp;JavaScript&nbsp;– Marseille
            </p>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="flex w-full max-w-xs flex-col gap-4 sm:max-w-none sm:flex-row md:gap-6"
          >
            {/* bouton Projets */}
            <Button
              asChild
              size="lg"
              className="group relative flex-1 overflow-hidden bg-primary text-white shadow-lg shadow-primary/40 transition-all duration-300 sm:flex-none"
            >
              <a href="#projets" aria-label="Voir mes projets">
                Projets
                <ArrowRight
                  aria-hidden="true"
                  className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </Button>

            {/* bouton Contact */}
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="group relative flex-1 overflow-hidden shadow-lg shadow-secondary/40 transition-all duration-300 sm:flex-none"
            >
              <a href="#contact" aria-label="Accéder au formulaire de contact">
                Contact
              </a>
            </Button>
          </motion.div>
        </div>

        {/* --- visuel 3D --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="aspect-[4/3] w-full sm:aspect-square md:h-[30rem]"
        >
          <ThreeHero />
        </motion.div>
      </div>

      {/* ---------- chevron scroll ---------- */}
      <a
        href="#a-propos"
        aria-label="Faire défiler vers la section À propos"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 transition-opacity hover:opacity-100"
      >
        <ChevronDown className="h-7 w-7 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  )
}
