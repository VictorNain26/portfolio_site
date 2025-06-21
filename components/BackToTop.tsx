'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  /* Affiche le bouton dès qu’on n’est plus sur la section Hero */
  useEffect(() => {
    const hero = document.getElementById('accueil')
    if (!hero) return
    const io = new IntersectionObserver(
      ([e]) => setShow(!e.isIntersecting),
      { threshold: 0 },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          initial={{ y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 32, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          href="#accueil"
          aria-label="Revenir en haut de page"
          onClick={(e) => {
            /* ── Scroll fluide dans le ScrollArea Radix ── */
            e.preventDefault()
            document
              .getElementById('accueil')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
          className="
            fixed z-40
            right-4 sm:right-8 lg:right-16
            bottom-[calc(1.5rem+env(safe-area-inset-bottom))]
            flex h-10 w-10 items-center justify-center
            rounded-full bg-indigo-600/90 text-white
            shadow-lg ring-1 ring-black/10
            hover:bg-indigo-500
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-indigo-400
          "
        >
          <ChevronUp className="h-5 w-5" aria-hidden="true" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
