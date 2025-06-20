import './globals.css'
import { Inter, Sora } from 'next/font/google'
import { ReactNode } from 'react'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const sora  = Sora ({ subsets: ['latin'], variable: '--font-sora',  display: 'swap' })

export const metadata = {
  title: 'Victor Lenain | Développeur Full-Stack JavaScript',
  description: 'Je construis des apps modernes.',
}

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

      {/* ------------------------------------------------------------------
           • bg-[#0e082e]           = couleur de fond de secours
           • bg-[url('/images/hero-bg.jpg')]  = image choisie
           • bg-fixed bg-cover bg-center     = effet parallax
         ------------------------------------------------------------------ */}
      <body
        className="
          font-sans antialiased text-foreground
          bg-[#0e082e]
          bg-[url('/images/hero-bg.jpg')] bg-no-repeat bg-cover bg-center bg-fixed
        "
      >
        {children}
      </body>
    </html>
  )
}
