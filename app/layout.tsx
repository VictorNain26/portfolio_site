import './globals.css';
import { Inter, Geist } from 'next/font/google';
import { type ReactNode, Suspense } from 'react';
import Script from 'next/script';

import ScrollView from '@/components/ScrollView';
import BackToTop from '@/components/BackToTop';
import HeaderBar from '@/components/HeaderBar';
import Footer from '@/components/Footer';
import MetaTags from './components/MetaTags';
import JsonLdScripts from './components/JsonLdScripts';

/* -------------------------------------------------------------------------- */
/* Polices                                                                    */
/*  - Inter : body. Très lisible, neutre.                                     */
/*  - Geist : display (headings). Identité techy/AI, signe la marque.         */
/* -------------------------------------------------------------------------- */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

/* -------------------------------------------------------------------------- */
/* Métadonnées                                                                */
/* -------------------------------------------------------------------------- */
export const metadata = {
  metadataBase: new URL('https://victorlenain.fr'),
  title: {
    default: 'Victor Lenain | Développeur full-stack · Intégration IA · Paris',
    template: '%s | Victor Lenain',
  },
  description:
    "Développeur full-stack freelance à Paris. Je greffe la couche IA (agents, RAG, automatisations LLM) sur votre stack web existante, sans refonte. Stack Next.js, Django, Rails, FastAPI.",
  keywords: [
    'développeur freelance Paris',
    'développeur full-stack',
    'intégration IA',
    'intégration LLM',
    'agents IA',
    'RAG',
    'Claude API',
    'OpenAI API',
    'Anthropic Claude',
    'pgvector',
    'LangChain',
    'Claude Agent SDK',
    'application web sur mesure',
    'développeur Next.js',
    'développeur TypeScript',
    'freelance développeur web',
    'Victor Lenain',
  ],
  authors: [{ name: 'Victor Lenain', url: 'https://victorlenain.fr' }],
  creator: 'Victor Lenain',
  publisher: 'Victor Lenain',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://victorlenain.fr',
    siteName: 'Victor Lenain - Portfolio',
    title: 'Victor Lenain | Développeur full-stack · Intégration IA · Paris',
    description:
      "Développeur full-stack freelance à Paris. Je greffe la couche IA (agents, RAG, automatisations LLM) sur votre stack web existante, sans refonte. Stack Next.js, Django, Rails, FastAPI.",
    // Images are generated dynamically by app/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Victor Lenain | Développeur full-stack · Intégration IA',
    description:
      "Freelance Paris. Je greffe agents, RAG et automatisations LLM sur votre stack web existante. Sans refonte.",
    // Images are generated dynamically by app/opengraph-image.tsx
  },
  alternates: {
    canonical: 'https://victorlenain.fr',
    languages: {
      fr: 'https://victorlenain.fr',
      'x-default': 'https://victorlenain.fr',
    },
  },
  category: 'Technology',
  classification: 'Business',
};

/* -------------------------------------------------------------------------- */
/* RootLayout                                                                 */
/* -------------------------------------------------------------------------- */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${inter.variable} ${geist.variable}`} lang="fr">
      <head>
        <MetaTags />
        <JsonLdScripts />
      </head>

      <body className="text-foreground relative bg-[#0e082e] font-sans antialiased">
        {/* Skip link accessibilité */}
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none"
          href="#main"
        >
          Aller au contenu
        </a>

        {/* Barre de navigation présente partout */}
        <HeaderBar />

        <ScrollView>
          {children}
          <Footer />
        </ScrollView>

        {/* Bouton « Remonter » */}
        <Suspense fallback={null}>
          <BackToTop />
        </Suspense>

        {/* Umami Analytics - privacy-friendly, no cookies */}
        <Script
          defer
          data-website-id="cddff34c-b72b-4f84-b155-b327edd3d634"
          src="https://cloud.umami.is/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
