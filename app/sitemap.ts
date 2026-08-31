import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://queuewise-kogleshofficial-hubs-projects.vercel.app'
  return [{ url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 }]
}
