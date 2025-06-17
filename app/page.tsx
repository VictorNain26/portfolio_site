import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Services from '@/components/Services'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="space-y-32">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Services />
      <Contact />
    </main>
  )
}
