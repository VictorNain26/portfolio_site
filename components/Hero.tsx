'use client'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

const ThreeHero = dynamic(() => import('@/components/ThreeHero'), {
  ssr: false,
  // Display a spinner while loading to avoid layout shift
  loading: () => (
    <div className="w-full h-96 flex items-center justify-center">
      <Spinner className="size-10 text-primary" />
    </div>
  ),
})

export default function Hero() {
  return (
    <section
      id="accueil"
      className="h-screen flex flex-col justify-center items-center text-center px-6"
    >
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-6xl font-display font-extrabold leading-tight"
      >
        Salut, moi c&apos;est <span className="text-primary">Victor Lenain</span>
        <br />
        Développeur Web & Ingénieur DevOps
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.7 }}
        className="w-full max-w-md mt-10"
      >
        <ThreeHero />
      </motion.div>

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
