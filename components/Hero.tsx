'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

/**
 * Canvas + three.js sont chargés uniquement côté client.
 * `suspense: true` permet d’utiliser <Suspense>.
 */
const ThreeHero = dynamic(() => import('@/components/ThreeHero'), {
  ssr: false,
  suspense: true,
})

export default function Hero() {
  return (
    <section
      id="accueil"
      className="h-screen flex flex-col items-center justify-center text-center px-6"
    >
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-6xl font-display font-extrabold leading-tight"
      >
        Salut, moi c&#39;est <span className="text-primary">Victor Lenain</span>
        <br />
        Développeur Web &amp; Ingénieur DevOps
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="mt-6 max-w-2xl text-lg text-muted-foreground"
      >
        J’aide les entreprises à livrer plus vite grâce à des architectures
        cloud robustes et des apps React performantes.
      </motion.p>

      {/* Canvas : même hauteur qu’après hydratation → pas de layout-shift */}
      <div className="w-full max-w-md h-96 mt-10">
        {/* On n’affiche plus rien pendant le chargement du bundle */}
        <Suspense fallback={null}>
          <ThreeHero />
        </Suspense>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="mt-10 flex gap-4"
      >
        <Button asChild size="lg">
          <a href="#projets">
            Voir mes projets <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <Button variant="outline" asChild size="lg">
          <a href="#contact">Me contacter</a>
        </Button>
      </motion.div>
    </section>
  )
}
