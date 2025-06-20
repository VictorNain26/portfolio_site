import { Mail } from 'lucide-react'

export default function Contact() {
  return (
    <section id="contact" className="max-w-4xl mx-auto px-4 scroll-mt-28">
      <h2 className="text-3xl font-display font-bold mb-6 text-indigo-400">
        Contact
      </h2>

      <p className="text-gray-300 mb-4">
        Une idée de projet ou une mission&nbsp;? Parlons-en.
      </p>

      <a
        href="mailto:victor.lenain26@gmail.com"
        className="
          inline-flex items-center gap-2 rounded-md bg-indigo-600
          px-6 py-3 text-sm font-medium text-white shadow
          hover:bg-indigo-500 transition
        "
      >
        <Mail className="h-4 w-4" />
        M’envoyer un e-mail
      </a>
    </section>
  )
}
