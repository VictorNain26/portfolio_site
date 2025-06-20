'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GithubIcon,
  Linkedin,
  Mail,
  Phone,
} from 'lucide-react'
import Logo from '@/components/Logo'

const socials = [
  {
    href: 'https://github.com/victornain26',
    label: 'GitHub',
    icon: GithubIcon,
  },
  {
    href: 'tel:+33600000000',
    label: 'Téléphone',
    icon: Phone,
  },
  {
    href: 'https://www.linkedin.com/in/victor-lenain-1907b7282/',
    label: 'LinkedIn',
    icon: Linkedin,
  },
  {
    href: 'mailto:victor.lenain26@gmail.com',
    label: 'Mail',
    icon: Mail,
  },
]

export default function HeaderBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = document.getElementById('hero-socials')
    if (!el) return

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setShow(!entry.isIntersecting)
      },
      {
        root: null,
        threshold: 0.01,
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.header
          initial={{ y: -32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -32, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`
            fixed top-0 left-0 w-full z-50
            px-2 sm:px-6 h-14
            flex items-center justify-between
            bg-gradient-to-r from-black/80 via-black/60 to-black/80
            backdrop-blur-xl
            border-b border-white/10
            shadow-[0_2px_32px_0_rgba(20,20,40,0.12)]
          `}
        >
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-auto sm:h-8" />
            <span className="hidden md:inline font-display font-extrabold text-xl sm:text-2xl tracking-tight text-white select-none">
              Victor&nbsp;Lenain
            </span>
          </div>
          <nav className="flex items-center gap-1.5 sm:gap-3">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className="
                  p-2 sm:p-2.5 rounded-full
                  bg-white/10
                  hover:bg-primary hover:text-white
                  transition
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-primary/80
                  text-white
                  flex items-center justify-center
                  shadow
                "
              >
                <Icon className="h-[20px] w-[20px] sm:h-[22px] sm:w-[22px] transition-all duration-200" aria-hidden="true" />
              </a>
            ))}
          </nav>
        </motion.header>
      )}
    </AnimatePresence>
  )
}
