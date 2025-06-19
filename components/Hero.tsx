'use client'

import dynamic     from 'next/dynamic'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Button }    from '@/components/ui/button'

/* Charge Three.js uniquement ≥ 640 px */
const ThreeHero = dynamic(() => import('@/components/ThreeHero'), {
  ssr: false,
  loading: () => null,
})

export default function Hero() {
  /* 3D seulement tablette + */
  const [show3D, setShow3D] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const toggle = (e: MediaQueryListEvent | MediaQueryList) =>
      setShow3D(e.matches)
    toggle(mq)
    mq.addEventListener('change', toggle)
    return () => mq.removeEventListener('change', toggle)
  }, [])

  const prefersReduceMotion = useReducedMotion()

  return (
    <section
      id="accueil"
      className="relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden pt-[calc(4rem+env(safe-area-inset-top))] sm:pt-0"
    >
      {/* ── Background ─────────────────────────────────────────────── */}
      <div
        role="img"
        aria-label="Fond futuriste représentant une grille 3D néon"
        className="absolute inset-0 -z-20 bg-[url('/images/hero-bg.jpg')] bg-cover bg-fixed bg-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/80 sm:bg-gradient-to-t lg:bg-gradient-to-r" />

      {/* ── Wrapper ───────────────────────────────────────────────── */}
      <div
        className="container mx-auto flex flex-col items-center gap-10 px-6
                   sm:max-w-2xl md:max-w-3xl
                   lg:grid lg:max-w-7xl lg:min-h-[70vh] lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:place-items-center lg:gap-16"
      >
        {/* 1 ▸ Titre ------------------------------------------------ */}
        <motion.header
          initial={prefersReduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={prefersReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="order-1 flex flex-col items-center text-center
                     lg:order-none lg:items-start lg:text-left"
        >
          <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
            Victor&nbsp;Lenain
          </h1>
          <p className="mt-3 max-w-xs text-base sm:max-w-md sm:text-lg md:text-xl text-white/90">
            Développeur&nbsp;Full-Stack&nbsp;JavaScript — Marseille
          </p>
        </motion.header>

        {/* 2 ▸ Visuel ---------------------------------------------- */}
        <motion.div
          initial={prefersReduceMotion ? false : { opacity: 0, scale: 0.9 }}
          whileInView={prefersReduceMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="order-2 aspect-square w-full max-w-md
                     sm:max-w-lg md:max-w-xl
                     lg:order-none lg:row-start-1 lg:col-start-2 lg:max-w-none lg:h-[32rem]"
        >
          {show3D ? (
            <ThreeHero />
          ) : (
            <img
              src="/images/torus-static.png"
              alt=""
              aria-hidden="true"
              width={512}
              height={512}
              className="h-full w-full select-none object-contain pointer-events-none"
            />
          )}
        </motion.div>

        {/* 3 ▸ Bouton Contact -------------------------------------- */}
        <motion.div
          initial={prefersReduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={prefersReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="order-3 w-full flex justify-center
                     lg:col-span-2 lg:row-start-2"
        >
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="group h-11 sm:h-12 px-8 sm:px-9 text-base
                       shadow-lg shadow-secondary/40
                       transition-transform duration-300
                       hover:-translate-y-0.5 hover:shadow-secondary/60
                       focus-visible:ring-4 focus-visible:ring-secondary/40"
          >
            <a href="#contact" aria-label="Accéder au formulaire de contact">
              Contact
              {/* petit effet d’icône en slide visible uniquement pour VISIBLE DÉSIGN */}
              <span
                className="ml-2 inline-block transition-transform duration-300
                           group-hover:translate-x-1 group-hover:-translate-y-0.5"
                aria-hidden="true"
              >
                ✉️
              </span>
            </a>
          </Button>
        </motion.div>
      </div>

      <a
        href="#a-propos"
        aria-label="Faire défiler vers la section À propos"
        className="absolute left-1/2 bottom-[calc(1.5rem+env(safe-area-inset-bottom))]
                  -translate-x-1/2 text-white/80 transition-opacity hover:opacity-100"
      >
        <ChevronDown
          className="h-7 w-7 animate-bounce-slow"
          aria-hidden="true"
        />
      </a>
    </section>
  )
}
