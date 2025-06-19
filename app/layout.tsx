import './globals.css'
import { Inter, Poppins } from 'next/font/google'
import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'


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
      <body className="bg-gray-900 text-gray-100 font-sans antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
