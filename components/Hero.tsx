'use client'

import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, GithubIcon, Linkedin, Mail, Phone } from 'lucide-react'

const PromptModelHero = dynamic(() => import('@/components/PromptModelHero'), { ssr: false })

export default function Hero() {
  const prefersReduceMotion = useReducedMotion()

  const socials = [
    { href: 'https://github.com/victornain26', icon: GithubIcon, label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/victor-lenain-1907b7282/', icon: Linkedin, label: 'LinkedIn' },
    { href: 'tel:+33600000000', icon: Phone, label: 'Téléphone' },
    { href: 'mailto:victor.lenain26@gmail.com?subject=Demande%20de%20mission', icon: Mail, label: 'Mail' },
  ]

  return (
    <section
      id="accueil"
      className="relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-0"
    >
      {/* ── Contenu principal ─────────────────────────────────────── */}
      <div
        className="
          mx-auto max-w-7xl
          flex flex-col items-start gap-14 sm:items-center sm:gap-10
          px-0 sm:px-8 lg:px-20
          lg:min-h-[70vh] lg:grid lg:grid-cols-2 lg:place-items-center lg:gap-16
        "
      >
        {/* Titre + tagline */}
        <motion.header
          initial={prefersReduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={prefersReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="order-1 flex flex-col items-start text-left sm:items-center sm:text-center lg:order-none lg:items-start lg:text-left"
        >
          <h1
            className="mb-2 font-display font-extrabold tracking-[-0.035em] bg-gradient-to-br from-[#6bb4d8] via-[#4288b7] to-[#2d5e81] text-transparent bg-clip-text text-[clamp(2.6rem,7.5vw,5.3rem)] leading-[1.05]"
          >
            Victor&nbsp;Lenain
          </h1>

          <div className="mb-3 flex items-center gap-3 sm:justify-center">
            <span className="h-1 w-8 rounded-full bg-gradient-to-r from-[#6bb4d8] via-[#4288b7] to-[#2d5e81]" />
            <p className="text-indigo-200 text-sm sm:text-base font-medium uppercase tracking-wide">
              Développeur&nbsp;Full-Stack
            </p>
          </div>

          {/* caché en mobile, visible ≥ sm */}
          <p className="hidden sm:block max-w-[28ch] sm:max-w-md text-sm sm:text-base text-gray-300">
            Apps web performantes, expériences&nbsp;3D et intégrations&nbsp;IA pour votre croissance.
          </p>
        </motion.header>

        {/* Visuel 3D */}
        <motion.div
          initial={prefersReduceMotion ? false : { opacity: 0, scale: 0.93 }}
          whileInView={prefersReduceMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="order-2 aspect-square w-full max-w-[340px] sm:max-w-md md:max-w-xl lg:order-none lg:max-w-none lg:h-[32rem] touch-pan-y"
        >
          <PromptModelHero />
        </motion.div>
      </div>

      {/* ── Réseaux sociaux ───────────────────────────────────────── */}
      <motion.nav
        initial={prefersReduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={prefersReduceMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-[calc(4.5rem+env(safe-area-inset-bottom))] w-full"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-20 flex justify-center gap-4 sm:gap-6">
          {socials.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="
                group rounded-full border border-black/10 bg-black/5 p-2.5 sm:p-3 shadow-sm
                transition-colors duration-200 hover:bg-black/20 hover:border-black/20
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60
                text-white dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/30 dark:hover:border-white/30
              "
            >
              <Icon className="h-5 w-5" aria-hidden />
            </a>
          ))}
        </div>
      </motion.nav>

      {/* ── Flèche vers la section suivante ───────────────────────── */}
      <a
        href="#a-propos"
        aria-label="Faire défiler vers la section À propos"
        className="absolute left-1/2 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] -translate-x-1/2 text-white/80 transition-opacity hover:opacity-100"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('a-propos')?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        <ChevronDown className="h-7 w-7 animate-bounce" aria-hidden />
      </a>
    </section>
  )
}
