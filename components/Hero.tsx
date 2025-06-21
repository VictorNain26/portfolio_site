'use client'

import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, GithubIcon, Linkedin, Mail, Phone } from 'lucide-react'

const PromptModelHero = dynamic(() => import('@/components/PromptModelHero'), {
  ssr: false,
  loading: () => null,
})

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
      className="
        relative isolate flex min-h-[100svh] flex-col items-center
        overflow-hidden pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-0
      "
    >

      {/* ── Wrapper ──────────────────────────────────────────────── */}
      <div
        className="
          container mx-auto flex flex-col items-center gap-10 px-4
          sm:max-w-2xl md:max-w-3xl
          lg:grid lg:max-w-7xl lg:min-h-[70vh] lg:grid-cols-2
          lg:grid-rows-[auto_auto] lg:place-items-center lg:gap-16
        "
      >
        {/* 1 ▸ Titre ------------------------------------------------------ */}
        <motion.header
          initial={prefersReduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={prefersReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="
            order-1 flex flex-col items-center text-center
            lg:order-none lg:items-start lg:text-left
          "
        >
          <h1
            className="
              mb-3 font-extrabold tracking-tight
              bg-gradient-to-br
                from-[#6bb4d8]   /* bleu clair  –  +25 % de luminosité */
                via-[#4288b7]    /* bleu logo   –  couleur pivot */
                to-[#2d5e81]     /* bleu foncé  –  -25 % de luminosité */
              text-transparent bg-clip-text
            "
            style={{
              fontFamily: 'var(--font-sora), var(--font-poppins), sans-serif',
              fontSize: 'clamp(2.8rem, 7vw, 5.3rem)',
              letterSpacing: '-0.035em',
              lineHeight: 1.08,
            }}
          >
            Victor&nbsp;Lenain
          </h1>
          <p className="mt-2 max-w-xs sm:max-w-md md:text-xl text-gray-300">
            Développeur Full-Stack JavaScript
          </p>
        </motion.header>

        {/* 2 ▸ Visuel 3D -------------------------------------------------- */}
        <motion.div
          initial={prefersReduceMotion ? false : { opacity: 0, scale: 0.93 }}
          whileInView={prefersReduceMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="
            order-2 aspect-square w-full max-w-[340px]
            sm:max-w-md md:max-w-xl
            lg:order-none lg:row-start-1 lg:col-start-2 lg:max-w-none lg:h-[32rem]
          "
        >
          <PromptModelHero />
        </motion.div>

        {/* 3 ▸ Réseaux sociaux ------------------------------------------- */}
        <motion.div
          id="hero-socials"
          initial={prefersReduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={prefersReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="
            order-3 w-full flex flex-wrap justify-center gap-4 sm:gap-6 mt-1
            lg:col-span-2 lg:row-start-2
          "
        >
          {socials.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="
                group flex flex-col items-center rounded-full
                border border-black/10 bg-black/5
                p-2.5 sm:p-3 shadow-sm
                transition-colors duration-200
                hover:bg-black/20 hover:border-black/20
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60
                text-white
                dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/30 dark:hover:border-white/30
              "
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">{label}</span>
            </a>
          ))}
        </motion.div>
      </div>

      {/* Flèche vers la section suivante */}
      <a
        href="#a-propos"
        aria-label="Faire défiler vers la section À propos"
        className="
          absolute left-1/2 bottom-[calc(1.5rem+env(safe-area-inset-bottom))]
          -translate-x-1/2 text-white/80 transition-opacity hover:opacity-100
        "
        onClick={(e) => {
          e.preventDefault();
          document
            .getElementById('a-propos')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      >
        <ChevronDown className="h-7 w-7 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  )
}
