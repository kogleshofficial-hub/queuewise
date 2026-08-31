import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QueueWise — Know the queue before you go',
  description: 'See recent community-reported waiting times at real-world services near you.',
  metadataBase: new URL('https://queuewise.vercel.app'),
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
