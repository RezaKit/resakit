import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ResaKit — Réserve l\'expérience, pas juste une table',
    template: '%s | ResaKit',
  },
  description:
    'Marketplace de réservation d\'expériences de groupe à Toulouse. EVJF, anniversaires, team building — escape games, ateliers cocktails, cours de cuisine et plus.',
  keywords: [
    'EVJF Toulouse',
    'anniversaire groupe Toulouse',
    'team building Toulouse',
    'escape game Toulouse',
    'atelier cocktail Toulouse',
    'activité groupe Toulouse',
    'ResaKit',
  ],
  authors: [{ name: 'ResaKit' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://resakit.fr',
    siteName: 'ResaKit',
    title: 'ResaKit — Expériences de groupe à Toulouse',
    description:
      'EVJF, anniversaires, team building. Réservation et paiement splitté entre participants en quelques clics.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResaKit',
    description: 'Expériences de groupe à Toulouse',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
