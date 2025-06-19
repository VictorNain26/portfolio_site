import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import { ReactNode } from 'react'
import Script from 'next/script'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  weight: ['700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata = {
  title: 'Victor Lenain | Développeur Full-Stack JavaScripts',
  description: 'Je construis des apps modernes.',
}

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <head>
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
              url: 'https://victorlenain.dev',   // ← remplace par ton domaine (à modifier)
              sameAs: [
                'https://www.linkedin.com/in/victor-lenain-1907b7282/',
                // 'https://github.com/ton-github' (à ajouter)
              ],
            }),
          }}
        />
      </head>

      <body className="bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
