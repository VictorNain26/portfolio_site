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
  metadataBase: new URL('https://victorlenain.fr'),
  title: {
    default: 'Victor Lenain | Développeur Full-Stack JavaScript & Expert Next.js',
    template: '%s | Victor Lenain'
  },
  description: 'Développeur Full-Stack JavaScript spécialisé en Next.js 15, React 19 et DevOps. Création d\'applications web modernes et performantes avec intelligence artificielle intégrée.',
  keywords: [
    'développeur full-stack',
    'JavaScript',
    'Next.js 15',
    'React 19',
    'TypeScript',
    'DevOps',
    'Intelligence artificielle',
    'Développement web',
    'Applications modernes',
    'Portfolio',
    'Victor Lenain'
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
    title: 'Victor Lenain | Développeur Full-Stack JavaScript & Expert Next.js',
    description: 'Développeur Full-Stack JavaScript spécialisé en Next.js 15, React 19 et DevOps. Création d\'applications web modernes et performantes.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Victor Lenain - Développeur Full-Stack JavaScript',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Victor Lenain | Développeur Full-Stack JavaScript',
    description: 'Spécialisé en Next.js 15, React 19 et DevOps. Créateur d\'applications web modernes.',
    images: ['/logo.png'],
    creator: '@victor_lenain',
    site: '@victor_lenain',
  },
  alternates: {
    canonical: 'https://victorlenain.fr',
    languages: {
      'fr': 'https://victorlenain.fr',
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
    <html lang="fr" className={`${inter.variable} ${sora.variable}`}>
      <head>
        <meta name="Victor-Lenain" content="victorlenain" />
        
        {/* ---- Favicons et icônes ---- */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/icon0.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        
        {/* ---- SEO et performance ---- */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="color-scheme" content="dark" />
        
        {/* ---- Verification et ownership ---- */}
        <meta name="google-site-verification" content="votre-code-verification-google" />
        <meta name="msvalidate.01" content="votre-code-verification-bing" />
        
        {/* ---- Préchargement de ressources critiques ---- */}
        <link rel="preload" href="/images/hero-bg.jpg" as="image" type="image/jpeg" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ---- JSON-LD Structured Data ---- */}
        <Script
          id="ld-person"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Victor Lenain',
              alternateName: 'Victor Lenain Dev',
              jobTitle: 'Développeur Full-Stack JavaScript & Expert Next.js',
              description: 'Développeur Full-Stack JavaScript spécialisé en Next.js 15, React 19 et DevOps. Expert en création d\'applications web modernes et performantes.',
              url: 'https://victorlenain.fr',
              image: 'https://victorlenain.fr/logo.png',
              sameAs: [
                'https://www.linkedin.com/in/victor-lenain-1907b7282/',
                'https://github.com/victorlenain',
                'https://twitter.com/victor_lenain'
              ],
              knowsAbout: [
                'JavaScript',
                'TypeScript',
                'Next.js',
                'React',
                'Node.js',
                'DevOps',
                'Intelligence Artificielle',
                'Développement Web',
                'Applications Web'
              ],
              worksFor: {
                '@type': 'Organization',
                name: 'Freelance',
                url: 'https://victorlenain.fr'
              },
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'FR',
                addressLocality: 'France'
              },
              offers: {
                '@type': 'Offer',
                description: 'Services de développement web Full-Stack',
                category: 'Développement Web'
              }
            }),
          }}
        />
        
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Website',
              name: 'Victor Lenain - Portfolio',
              alternateName: 'Portfolio Victor Lenain',
              url: 'https://victorlenain.fr',
              description: 'Portfolio professionnel de Victor Lenain, développeur Full-Stack JavaScript spécialisé en Next.js et React.',
              inLanguage: 'fr-FR',
              author: {
                '@type': 'Person',
                name: 'Victor Lenain'
              },
              publisher: {
                '@type': 'Person',
                name: 'Victor Lenain'
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://victorlenain.fr/blog?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            }),
          }}
        />

        <Script
          id="ld-professional-service"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'Victor Lenain - Services de Développement Web',
              description: 'Services professionnels de développement web Full-Stack avec Next.js, React et TypeScript.',
              url: 'https://victorlenain.fr',
              image: 'https://victorlenain.fr/logo.png',
              provider: {
                '@type': 'Person',
                name: 'Victor Lenain'
              },
              areaServed: {
                '@type': 'Country',
                name: 'France'
              },
              serviceType: [
                'Développement Web',
                'Applications Next.js',
                'Conseil Technique',
                'Formation JavaScript'
              ],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Services de développement',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Développement d\'applications web',
                      description: 'Création d\'applications web modernes avec Next.js et React'
                    }
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Conseil technique',
                      description: 'Conseil en architecture et choix technologiques'
                    }
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Formation',
                      description: 'Formation aux technologies modernes JavaScript'
                    }
                  }
                ]
              }
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
