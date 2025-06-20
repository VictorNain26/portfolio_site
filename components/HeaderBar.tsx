'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  GithubIcon,
  Linkedin,
  Mail,
  Phone,
} from 'lucide-react'

const socials = [
  { href: 'https://github.com/victornain26', icon: GithubIcon, label: 'GitHub' },
  { href: 'tel:+33600000000',                icon: Phone,     label: 'Téléphone' },
  { href: 'https://www.linkedin.com/in/victor-lenain-1907b7282/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:victor.lenain26@gmail.com', icon: Mail,      label: 'Mail' },
]

export default function HeaderBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const target = document.getElementById('hero-socials')
    if (!target) return

    const io = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0.01 }
    )
    io.observe(target)
    return () => io.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.header
          initial={{ y: -32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -32, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="
            fixed top-0 inset-x-0 z-50 h-16
            backdrop-blur-lg
            transition-colors
            /* ---- couleur de fond (glassmorphism) ---- */
            bg-background/20 dark:bg-black/30
            shadow-[0_2px_32px_0_rgba(0,0,0,0.15)]
          "
        >
          {/* Container aligné sur le Hero */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* -------- logo + nom -------- */}
            <div className="flex items-center gap-3 select-none">
              <Image
                src="/logo.png"        /* ou /logo.svg  */
                alt="Logo Victor Lenain"
                width={56} height={56} /* taille intrinsèque */
                priority
                className="h-12 w-12 sm:h-14 sm:w-14"
              />
              <span className="hidden md:inline font-display font-extrabold text-2xl tracking-tight text-white">
                Victor&nbsp;Lenain
              </span>
            </div>

            {/* -------- réseaux -------- */}
            <nav className="flex items-center gap-2 sm:gap-3">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="
                    p-2 sm:p-2.5 rounded-full
                    bg-white/10 hover:bg-primary hover:text-white
                    transition
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80
                    text-white shadow
                  "
                >
                  <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  )
}
