import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="space-y-16 sm:space-y-24 lg:space-y-32">
      <Hero />
      <Services />
      <Projects />
      <Contact />
    </main>
  );
}
