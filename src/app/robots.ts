import type { MetadataRoute } from 'next'

const SITE_URL = 'https://verzel-elitedev-eventos.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/organizer', '/organizer/*', '/gate', '/gate/*', '/my-tickets', '/login'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
