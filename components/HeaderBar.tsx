// components/HeaderBar.tsx
'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { GithubIcon, Linkedin, Mail, Phone } from 'lucide-react'

const socials = [
  { href: 'https://github.com/victornain26', icon: GithubIcon, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/victor-lenain-1907b7282/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'tel:+33600000000',                icon: Phone,       label: 'Téléphone' },
  { href: 'mailto:victor.lenain26@gmail.com', icon: Mail,       label: 'Mail' },
]

export default function HeaderBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('accueil')
    if (!hero) return
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting))
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.header
          initial={{ y: -32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -32, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="
            fixed inset-x-0 top-0 z-50
            bg-gradient-to-b from-white/80 via-white/70 to-white/60
            dark:from-white/10 dark:via-white/5 dark:to-white/0
            backdrop-blur-md ring-1 ring-black/10 dark:ring-white/15
            shadow-sm
            /* padding horizontal plus large sur desktop */
            px-4 sm:px-8 lg:px-20 xl:px-28 2xl:px-36
            py-1.5 md:py-2 lg:py-3
            text-[#0e082e] dark:text-white
          "
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">

            {/* Logo réduit */}
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              priority
              className="h-12 w-12 sm:h-12 sm:w-12 select-none"
            />

            {/* Pastilles sociales — hover plus foncé (classes valides) */}
            <nav className="flex items-center gap-1.5 sm:gap-2">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="
                    group flex flex-col items-center rounded-full
                    border border-black/10 bg-black/5
                    p-1.5 sm:p-2 shadow-sm
                    transition-colors duration-200
                    hover:bg-black/20 hover:border-black/20
                    dark:bg-white/10 dark:border-white/20
                    dark:hover:bg-white/30 dark:hover:border-white/30
                    text-[#0e082e] dark:text-white
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                  "
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  )
}
