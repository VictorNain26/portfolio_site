import Section from '@/components/Section'
import { Mail } from 'lucide-react'

export default function Contact() {
  return (
    <Section id="contact" className="max-w-4xl mx-auto px-4 pb-40 scroll-mt-28">
      <h2 className="mb-4 text-3xl font-display font-bold text-indigo-400">Contact</h2>

      <p className="text-gray-300 mb-6 max-w-md">
        Une idée de projet ou une mission&nbsp;? Discutons-en&nbsp;!
      </p>

      <a
        href="mailto:victor.lenain26@gmail.com"
        className="relative inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-sm font-medium text-white shadow-lg overflow-hidden transition-transform duration-200 hover:bg-indigo-500 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        <Mail className="h-5 w-5" aria-hidden="true" />
        Écrivez-moi
        <span aria-hidden className="absolute inset-0 rounded-full bg-indigo-500/60 animate-[pulse_6s_ease-in-out_infinite]" />
      </a>
    </Section>
  )
}
