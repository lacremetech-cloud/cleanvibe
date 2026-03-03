import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#7C3AED',
}

export const metadata: Metadata = {
  title: 'CleanVibe — Music that elevates',
  description: 'The premium streaming platform for feel-good music. Discover artists, build playlists, and listen free.',
  keywords: ['music', 'streaming', 'halal', 'cleanvibe'],
  openGraph: {
    title: 'CleanVibe',
    description: 'Music that elevates. Stream for free.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-[#0A0A15] text-[#F1F5F9]" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
