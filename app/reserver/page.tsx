import type { Metadata } from 'next';

import CalInlineBooker from '@/components/CalInlineBooker';
import FadeOnView from '@/components/FadeOnView';
import Section from '@/components/Section';

const BASE_URL = 'https://victorlenain.fr';
const URL = `${BASE_URL}/reserver`;
const TITLE = 'Réserver un échange de 15 minutes';
const DESCRIPTION =
  'Premier échange gratuit et sans engagement avec Victor Lenain, développeur full-stack freelance à Paris. 15 minutes pour cadrer votre besoin en visio.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: 'website' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function ReserverPage() {
  return (
    <main className="relative pt-24 sm:pt-28" id="main">
      {/* Même halo de marque que les autres pages de tête. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-brand-hover/[0.10] blur-[140px]" />
      </div>

      <Section className="pb-24">
        <FadeOnView className="mx-auto max-w-2xl text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="label-mono text-brand-accent">Réserver</span>
          </div>

          <h1 className="heading-2 text-balance text-white">Quinze minutes, en visio.</h1>

          <p className="text-lead mx-auto mt-5 max-w-xl text-pretty text-gray-400">
            Premier échange gratuit et sans engagement. Vous exposez le besoin, je dis franchement
            si je peux aider, à quel coût et dans quel délai — ou vers qui vous tourner si ce
            n&apos;est pas moi.
          </p>

          <ul className="label-mono mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-gray-500">
            <li>15 minutes</li>
            <li aria-hidden="true">·</li>
            <li>En visio</li>
            <li aria-hidden="true">·</li>
            <li>Sans engagement</li>
          </ul>
        </FadeOnView>

        <FadeOnView className="mt-14" delay={0.1}>
          <CalInlineBooker />
        </FadeOnView>

        <FadeOnView className="mt-10 text-center" delay={0.15}>
          <p className="text-sm text-gray-500">
            Aucun créneau qui vous convient ? Écrivez-moi à{' '}
            <a
              className="text-brand-light underline-offset-4 transition-colors hover:text-brand-lighter hover:underline"
              href="mailto:victor.lenain26@gmail.com"
            >
              victor.lenain26@gmail.com
            </a>
            .
          </p>
        </FadeOnView>
      </Section>
    </main>
  );
}
