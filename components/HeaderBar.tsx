'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { GithubIcon, Linkedin, Mail, Phone } from 'lucide-react'

const socials = [
  { href: 'https://github.com/victornain26', icon: GithubIcon, label: 'GitHub' },
  { href: 'tel:+33600000000',                icon: Phone,       label: 'Téléphone' },
  { href: 'https://www.linkedin.com/in/victor-lenain-1907b7282/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:victor.lenain26@gmail.com', icon: Mail,       label: 'Mail' },
]

export default function HeaderBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const target = document.getElementById('accueil')
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting), // header uniquement quand Hero n’est plus visible
      { threshold: 0, rootMargin: '0px' },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.header
          initial={{ y: -32, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{    y: -32, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="
            fixed inset-x-0 top-0 z-50 h-16
            backdrop-blur-lg
            bg-gray-900/80 text-white
            shadow-[0_2px_32px_0_rgba(0,0,0,0.20)]
          "
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 select-none">
              <div className="rounded-full bg-white/10 p-1.5 sm:p-2">
                <Image
                  src="/logo.png"
                  alt="Logo Victor Lenain"
                  width={56}
                  height={56}
                  priority
                  className="h-12 w-12 sm:h-14 sm:w-14"
                />
              </div>
              <span className="hidden md:inline font-display text-2xl font-extrabold tracking-tight">
                Victor&nbsp;Lenain
              </span>
            </div>

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
                    bg-gray-900/10 text-white shadow transition
                    hover:bg-indigo-500 hover:text-white
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/80
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
