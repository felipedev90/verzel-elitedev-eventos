import type { MetadataRoute } from 'next'
import { prisma } from '@/server/db'

const SITE_URL = 'https://verzel-elitedev-eventos.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await prisma.event.findMany({
    where: { published: true },
    select: { slug: true, createdAt: true },
  })

  const eventUrls: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${SITE_URL}/eventos/${event.slug}`,
    lastModified: event.createdAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...eventUrls,
  ]
}
