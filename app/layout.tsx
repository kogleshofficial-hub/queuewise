import type { Metadata } from 'next'
import './globals.css'

const siteUrl = 'https://queuewise-app.vercel.app/'
const googleVerification = 'LI6z3Avdq6RsVP2faZ6nlhcbRwvnMIdjJkrSBygvnZM'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'QueueWise — Know the queue before you go',
    template: '%s | QueueWise',
  },
  description:
    'QueueWise helps people check recent community-reported waiting times and crowd situations at real-world services near them. Fresh observations, transparent estimates, no fabricated queue data.',
  keywords: [
    'QueueWise',
    'queue tracker',
    'waiting times',
    'wait time tracker',
    'live queue information',
    'community reported waiting times',
    'public service waiting times',
    'clinic waiting times',
    'bank queue waiting times',
  ],
  authors: [{ name: 'Koglesh R. Murugan' }],
  creator: 'Koglesh R. Murugan',
  publisher: 'QueueWise',
  applicationName: 'QueueWise',
  category: 'utilities',
  classification: 'Community queue and waiting-time information',
  alternates: {
    canonical: '/',
  },
  verification: {
    google: googleVerification,
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'QueueWise — Know the queue before you go',
    description:
      'See recent community-reported waiting times and crowd situations at real-world services near you.',
    url: siteUrl,
    siteName: 'QueueWise',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'QueueWise — Know the queue before you go',
    description:
      'Community-reported waiting times for real-world services, with fresh reports and transparent estimates.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      url: siteUrl,
      name: 'QueueWise',
      description:
        'Community-reported waiting times and queue situations for real-world services.',
      inLanguage: 'en',
    },
    {
      '@type': 'WebApplication',
      '@id': `${siteUrl}#app`,
      url: siteUrl,
      name: 'QueueWise',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      description:
        'Check recent community-reported waiting times and crowd situations at real-world services near you.',
      creator: {
        '@type': 'Person',
        name: 'Koglesh R. Murugan',
      },
      isAccessibleForFree: true,
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}#creator`,
      name: 'Koglesh R. Murugan',
      url: 'https://github.com/kogleshofficial-hub',
    },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content={googleVerification} />
        <link rel="canonical" href={siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
