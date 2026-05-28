import { Mail, MessageCircle, Calendar, ArrowRight } from 'lucide-react';
import Section from '@/components/Section';
import CalPopupButton from '@/components/CalPopupButton';
import FadeOnView from '@/components/FadeOnView';

export default function Contact() {
  return (
    <Section className="scroll-mt-28 pb-32" id="contact">
      <FadeOnView className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-line-2 bg-surface-1 px-6 py-16 text-center backdrop-blur-sm sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"
        />

        <div className="relative">
          <h2 className="font-display mb-4 text-3xl font-bold text-white sm:text-4xl">
            Parlons de votre projet
          </h2>

          <p className="mx-auto mb-10 max-w-md text-lg text-gray-400">
            15 minutes par téléphone pour cadrer le besoin. Si je ne suis pas le bon profil, je vous le dis et je vous oriente.
          </p>

          <CalPopupButton
            className="group inline-flex items-center gap-3 rounded-full bg-brand px-8 py-4 text-base font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-glow-lg focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none"
            data-umami-event="cta-contact-cal"
          >
            <Calendar aria-hidden className="h-5 w-5" />
            Réserver un call de 15&nbsp;min
            <ArrowRight
              aria-hidden
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </CalPopupButton>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface-2 px-5 py-2.5 text-sm font-medium text-gray-400 backdrop-blur-sm transition-all duration-200 hover:border-gray-500/50 hover:text-white focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none"
              data-umami-event="cta-contact-email"
              href="mailto:victor.lenain26@gmail.com?subject=Demande%20de%20mission"
            >
              <Mail aria-hidden className="h-4 w-4" />
              Par email
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface-2 px-5 py-2.5 text-sm font-medium text-gray-400 backdrop-blur-sm transition-all duration-200 hover:border-gray-500/50 hover:text-white focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none"
              data-umami-event="cta-contact-whatsapp"
              href="https://wa.me/33664422529?text=Bonjour%20Victor%2C%20je%20souhaiterais%20discuter%20d%27un%20projet%20avec%20vous"
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </FadeOnView>
    </Section>
  );
}
