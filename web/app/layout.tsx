import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Baby Tracker - Track Your Baby\'s Journey',
  description: 'Track your baby\'s daily activities with intelligent AI. Easy logging, smart photo scanning, and beautiful growth insights.',
  keywords: 'baby tracker, feeding log, diaper tracker, sleep tracking, baby activities, parenting app',
  authors: [{ name: 'Baby Tracker Team' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Baby Tracker - Track Your Baby\'s Journey',
    description: 'Track your baby\'s daily activities with intelligent AI',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
