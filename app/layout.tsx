import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import { ReactNode } from 'react'


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
  title: 'Mon Portfolio | Dev Web & DevOps',
  description: 'Je construis des apps modernes et des pipelines DevOps efficaces.',
}

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
