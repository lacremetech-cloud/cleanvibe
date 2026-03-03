import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'CleanVibe — Music that elevates',
  description: 'The premium streaming platform for feel-good music. Discover artists, build playlists, and listen free.',
  keywords: ['music', 'streaming', 'halal', 'cleanvibe'],
  themeColor: '#7C3AED',
  openGraph: {
    title: 'CleanVibe',
    description: 'Music that elevates. Stream for free.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#0A0A15] text-[#F1F5F9]`}>
        {children}
      </body>
    </html>
  )
}
