import Section from '@/components/Section'
import { Mail } from 'lucide-react'

export default function Contact() {
  return (
    <Section id="contact" className="pb-40 scroll-mt-28">
      <h2 className="mb-4 text-3xl font-display font-bold text-indigo-400">Contact</h2>

      <p className="mb-6 max-w-md text-gray-300">
        Une idée de projet ou une mission&nbsp;? Discutons-en !
      </p>

      <a
        href="mailto:victor.lenain26@gmail.com?subject=Demande%20de%20mission"
        className="relative inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-sm font-medium text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        <Mail className="h-5 w-5" aria-hidden />
        Écrivez-moi
        <span aria-hidden className="absolute inset-0 rounded-full bg-indigo-500/60 animate-[pulse_6s_ease-in-out_infinite]" />
      </a>
    </Section>
  )
}
