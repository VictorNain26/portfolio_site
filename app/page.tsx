import Hero from '@/components/Hero';
import TechLogos from '@/components/TechLogos';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import BlogFloatingButton from '@/components/BlogFloatingButton';

export default function Home() {
  return (
    <>
      <BlogFloatingButton />

      <main className="space-y-16 sm:space-y-24 lg:space-y-32">
        <Hero />
        <TechLogos />
        <About />
        <Skills />
        <Projects />
        <Services />
        <Contact />
      </main>
    </>
  );
}
