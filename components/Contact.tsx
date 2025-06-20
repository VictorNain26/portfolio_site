import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export default function Contact() {
  return (
    <section id="contact" className="max-w-4xl mx-auto px-4 scroll-mt-20">
      <h2 className="text-3xl font-display font-bold mb-6">Contact</h2>
      <p className="text-gray-200 mb-4">
        Une idée de projet ou une mission ? Parlons-en.
      </p>
      <Button size="lg" asChild>
        <a href="mailto:victor.lenain26@gmail.com">
          <Mail className="mr-2 h-4 w-4" />
          M’envoyer un e-mail
        </a>
      </Button>
    </section>
  )
}
