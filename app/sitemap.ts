import type { MetadataRoute } from 'next'

const baseUrl = 'https://queuewise-app.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 }]
}
