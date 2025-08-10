import Section from '@/components/Section';
import { Mail } from 'lucide-react';

export default function Contact() {
  return (
    <Section className="flex scroll-mt-28 flex-col items-center pb-40 text-center" id="contact">
      {/* Titre */}
      <h2 className="font-display mb-4 text-3xl font-bold text-indigo-400">Contact</h2>

      {/* Paragraphe intro */}
      <p className="mb-8 max-w-md text-gray-300">
        Une idée de projet ou une mission&nbsp;? Discutons-en&nbsp;!
      </p>

      {/* Bouton mail */}
      <a
        className="relative inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-sm font-medium text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
        href="mailto:victor.lenain26@gmail.com?subject=Demande%20de%20mission"
      >
        <Mail aria-hidden className="h-5 w-5" />
        Écrivez-moi
        <span
          aria-hidden
          className="absolute inset-0 animate-[pulse_6s_ease-in-out_infinite] rounded-full bg-indigo-500/60"
        />
      </a>
    </Section>
  );
}
