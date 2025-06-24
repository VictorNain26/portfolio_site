"use client"

import dynamic from "next/dynamic"
import { motion, useReducedMotion } from "framer-motion"
import {
  ChevronDown,
  GithubIcon,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react"
import { SocialIconButton } from "@/components/ui/social-icon-button"

const PromptModelHero = dynamic(
  () => import("@/components/PromptModelHero"),
  { ssr: false },
)

export default function Hero() {
  const prefersReduceMotion = useReducedMotion()

  return (
    <section
      id="accueil"
      className="relative flex min-h-[100svh] flex-col items-center overflow-hidden pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-0"
    >
      {/* ── Contenu principal ─────────────────────────────────────── */}
      <div
        className="
          mx-auto max-w-7xl
          flex flex-col gap-14 sm:items-center sm:gap-10
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
          className="order-1 flex flex-col sm:items-center lg:order-none lg:items-start"
        >
          <h1
            className="
              gradient-brand-text
              mb-2 font-display font-extrabold tracking-[-0.035em]
              text-[clamp(2.6rem,7.5vw,5.3rem)] leading-[1.05]
            "
          >
            Victor&nbsp;Lenain
          </h1>

          <div className="mb-3 flex items-center gap-3 sm:justify-center">
            <span className="h-1 w-8 rounded-full bg-gradient-to-r from-[#6bb4d8] via-[#4288b7] to-[#2d5e81]" />
            <p className="text-indigo-200 text-sm sm:text-base font-medium uppercase tracking-wide">
              Développeur&nbsp;Full-Stack
            </p>
          </div>

          <p className="hidden sm:block max-w-[28ch] sm:max-w-md text-sm sm:text-base text-gray-300">
            Apps web performantes, expériences&nbsp;3D et intégrations&nbsp;IA
            pour votre croissance.
          </p>
        </motion.header>

        {/* Visuel 3D */}
        <motion.div
          initial={prefersReduceMotion ? false : { opacity: 0, scale: 0.93 }}
          whileInView={prefersReduceMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="order-2 aspect-square max-w-[340px] sm:max-w-md md:max-w-xl lg:order-none lg:max-w-none lg:h-[32rem] touch-pan-y"
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
          <SocialIconButton
            href="https://github.com/victornain26"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon />
          </SocialIconButton>

          <SocialIconButton
            href="https://www.linkedin.com/in/victor-lenain-1907b7282/"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin />
          </SocialIconButton>

          <SocialIconButton href="tel:+33600000000" aria-label="Téléphone">
            <Phone />
          </SocialIconButton>

          <SocialIconButton
            href="mailto:victor.lenain26@gmail.com?subject=Demande%20de%20mission"
            aria-label="Mail"
          >
            <Mail />
          </SocialIconButton>
        </div>
      </motion.nav>

      {/* ── Flèche vers la section suivante ───────────────────────── */}
      <a
        href="#a-propos"
        aria-label="Faire défiler vers la section À propos"
        className="absolute left-1/2 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] -translate-x-1/2 text-white/80 transition-opacity hover:opacity-100"
        onClick={(e) => {
          e.preventDefault()
          document
            .getElementById("a-propos")
            ?.scrollIntoView({ behavior: "smooth" })
        }}
      >
        <ChevronDown className="h-7 w-7 animate-bounce" aria-hidden />
      </a>
    </section>
  )
}
