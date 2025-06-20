'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { GithubIcon, Linkedin, Mail, Phone } from 'lucide-react'

const socials = [
  { href: 'https://github.com/victornain26', icon: GithubIcon, label: 'GitHub' },
  { href: 'tel:+33600000000', icon: Phone, label: 'Téléphone' },
  { href: 'https://www.linkedin.com/in/victor-lenain-1907b7282/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:victor.lenain26@gmail.com', icon: Mail, label: 'Mail' },
]

export default function HeaderBar() {
  const [show, setShow] = useState(false)

  // On observe le Hero entier (section #accueil)
  useEffect(() => {
    const target = document.getElementById('accueil')
    if (!target) return
    const io = new IntersectionObserver(
      ([entry]) => setShow(entry.intersectionRatio === 0),
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
            fixed inset-x-0 top-0 z-50 h-16
            backdrop-blur-lg
            bg-header/80 text-header-foreground
            shadow-[0_2px_32px_0_rgba(0,0,0,0.20)]
          "
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo + nom */}
            <div className="flex items-center gap-3 select-none">
              <div className="rounded-full bg-header-foreground/10 p-1.5 sm:p-2">
                <Image
                  src="/logo.png"
                  alt="Logo Victor Lenain"
                  width={56}
                  height={56}
                  priority
                  className="h-12 w-12 sm:h-14 sm:w-14"
                />
              </div>
              <span className="hidden md:inline font-display text-2xl font-extrabold tracking-tight text-header-foreground">
                Victor&nbsp;Lenain
              </span>
            </div>

            {/* Réseaux sociaux */}
            <nav className="flex items-center gap-2 sm:gap-3">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="
                    flex items-center justify-center rounded-full p-2 sm:p-2.5
                    bg-header/10 text-header-foreground shadow transition
                    hover:bg-primary hover:text-primary-foreground
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80
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
