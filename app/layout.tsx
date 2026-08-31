import type { Metadata } from 'next'
import './globals.css'

const siteUrl = 'https://queuewise-app.vercel.app'
const googleVerification = 'LI6z3Avdq6RsVP2faZ6nlhcbRwvnMIdjJkrSBygvnZM'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'QueueWise — Know the queue before you go',
  description: 'Find recent community-reported waiting times at real-world services near you. Transparent estimates, fresh reports, and no fabricated queue data.',
  keywords: ['waiting times', 'queue tracker', 'live queues', 'community reports', 'public services', 'QueueWise'],
  authors: [{ name: 'Koglesh R. Murugan' }],
  creator: 'Koglesh R. Murugan',
  applicationName: 'QueueWise',
  verification: { google: googleVerification },
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  openGraph: {
    title: 'QueueWise — Know the queue before you go',
    description: 'See recent community-reported waiting times at real-world services near you.',
    url: siteUrl,
    siteName: 'QueueWise',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'QueueWise — Know the queue before you go',
    description: 'Community-reported waiting times for real-world services.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content={googleVerification} />
      </head>
      <body>{children}</body>
    </html>
  )
}
