import Section from '@/components/Section';
import CalPopupButton from '@/components/CalPopupButton';
import { Mail, Calendar, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <Section className="flex scroll-mt-28 flex-col items-center pb-40 text-center" id="contact">
      {/* Titre */}
      <h2 className="font-display mb-4 text-3xl font-bold text-indigo-400">
        Parlons de votre projet
      </h2>

      {/* Paragraphe intro */}
      <p className="mb-8 max-w-md text-gray-300">
        Premier échange gratuit et sans engagement. On regarde ensemble si je peux vous aider.
      </p>

      {/* CTA principal - Réserver un call */}
      <CalPopupButton
        className="relative inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-sm font-medium text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
        data-umami-event="cta-contact-cal"
      >
        <Calendar aria-hidden className="h-5 w-5" />
        Réserver un call de 15&nbsp;min
        <span
          aria-hidden
          className="absolute inset-0 animate-[pulse_6s_ease-in-out_infinite] rounded-full bg-indigo-500/60"
        />
      </CalPopupButton>

      {/* CTAs secondaires */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <a
          className="inline-flex items-center gap-2 rounded-full border border-gray-700 px-6 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500/50 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
          data-umami-event="cta-contact-email"
          href="mailto:victor.lenain26@gmail.com?subject=Demande%20de%20mission"
        >
          <Mail aria-hidden className="h-4 w-4" />
          Par email
        </a>
        <a
          className="inline-flex items-center gap-2 rounded-full border border-gray-700 px-6 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-indigo-500/50 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
          data-umami-event="cta-contact-whatsapp"
          href="https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous"
          rel="noopener noreferrer"
          target="_blank"
        >
          <MessageCircle aria-hidden className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </Section>
  );
}
