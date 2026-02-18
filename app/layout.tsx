import './globals.css';
import { Inter, Sora } from 'next/font/google';
import { type ReactNode, Suspense } from 'react';
import Script from 'next/script';

import ScrollView from '@/components/ScrollView';
import BackToTop from '@/components/BackToTop';
import HeaderBar from '@/components/HeaderBar';
import MetaTags from './components/MetaTags';
import JsonLdScripts from './components/JsonLdScripts';

/* -------------------------------------------------------------------------- */
/* Polices                                                                    */
/* -------------------------------------------------------------------------- */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

/* -------------------------------------------------------------------------- */
/* Métadonnées                                                                */
/* -------------------------------------------------------------------------- */
export const metadata = {
  metadataBase: new URL('https://victorlenain.fr'),
  title: {
    default: 'Victor Lenain | Développeur Full-Stack Freelance à Paris',
    template: '%s | Victor Lenain',
  },
  description:
    "Développeur Full-Stack freelance à Paris. Applications web sur mesure, de l'idée au déploiement. Un interlocuteur unique qui s'adapte à vos besoins.",
  keywords: [
    'développeur freelance Paris',
    'développeur full-stack',
    'application web sur mesure',
    'freelance développeur web',
    'création application web',
    'développeur freelance',
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
    title: 'Victor Lenain | Développeur Full-Stack Freelance à Paris',
    description:
      "Développeur Full-Stack freelance à Paris. Applications web sur mesure, de l'idée au déploiement.",
    // Images are generated dynamically by app/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Victor Lenain | Développeur Full-Stack Freelance',
    description:
      "Applications web sur mesure, de l'idée au déploiement. Freelance à Paris.",
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
    <html className={`${inter.variable} ${sora.variable}`} lang="fr">
      <head>
        <MetaTags />
        <JsonLdScripts />
      </head>

      <body className="text-foreground relative bg-[#0e082e] bg-[url('/images/hero-bg.webp')] bg-cover bg-fixed bg-center bg-no-repeat font-sans antialiased">
        {/* Dégradé d'assombrissement du fond */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/25 to-black/60 sm:bg-gradient-to-t lg:bg-gradient-to-r" />

        {/* Barre de navigation présente partout */}
        <HeaderBar />

        <ScrollView>{children}</ScrollView>

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
