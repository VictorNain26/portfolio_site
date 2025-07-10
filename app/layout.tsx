import './globals.css';
import { Inter, Sora } from 'next/font/google';
import { type ReactNode, Suspense } from 'react';
import Script from 'next/script';

import ScrollView from '@/components/ScrollView';
import BackToTop from '@/components/BackToTop';
import HeaderBar from '@/components/HeaderBar';

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
  metadataBase: new URL('https://victorlenain.fr'), // pour OG absolus
  title: 'Victor Lenain | Développeur Full-Stack JavaScript',
  description: 'Je construis des apps modernes.',
};

/* -------------------------------------------------------------------------- */
/* RootLayout                                                                 */
/* -------------------------------------------------------------------------- */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <meta name="Victor-Lenain" content="victorlenain" />

        {/* ---- JSON-LD ---- */}
        <Script
          id="ld-person"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Victor Lenain',
              jobTitle: 'Développeur Full-Stack JavaScript',
              url: 'https://victorlenain.dev',
              sameAs: ['https://www.linkedin.com/in/victor-lenain-1907b7282/'],
            }),
          }}
        />
      </head>

      <body className="relative bg-[#0e082e] bg-[url('/images/hero-bg.jpg')] bg-cover bg-fixed bg-center bg-no-repeat font-sans text-foreground antialiased">
        {/* Dégradé d’assombrissement du fond */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-black/50 via-black/25 to-black/60 sm:bg-gradient-to-t lg:bg-gradient-to-r" />

        {/* Barre de navigation présente partout */}
        <HeaderBar />

        <ScrollView>{children}</ScrollView>

        {/* Bouton « Remonter » */}
        <Suspense fallback={null}>
          <BackToTop />
        </Suspense>
      </body>
    </html>
  );
}
