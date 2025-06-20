import './globals.css'
import { Inter, Sora } from 'next/font/google'
import { ReactNode } from 'react'
import Script from 'next/script'

// Police texte : Inter
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Police titres : Sora
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

export const metadata = {
  title: 'Victor Lenain | Développeur Full-Stack JavaScript',
  description: 'Je construis des apps modernes.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${sora.variable}`}>
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
              url: 'https://victorlenain.dev',
              sameAs: [
                'https://www.linkedin.com/in/victor-lenain-1907b7282/',
                // 'https://github.com/victornain26'
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
