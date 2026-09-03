import type { MetadataRoute } from 'next'

const siteUrl = 'https://queuewise-app.vercel.app/'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date('2026-09-03T00:00:00.000Z'),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}
