import { prisma } from '@/server/db'

type CatalogFilters = {
  search?: string
  city?: string
}

export async function getFeaturedEvents() {
  return prisma.event.findMany({
    where: { published: true },
    orderBy: { startsAt: 'asc' },
    take: 5,
  })
}

export async function getCatalogEvents(filters: CatalogFilters) {
  return prisma.event.findMany({
    where: {
      published: true,
      ...(filters.search ? { title: { contains: filters.search, mode: 'insensitive' } } : {}),
      ...(filters.city ? { city: { equals: filters.city, mode: 'insensitive' } } : {}),
    },
    orderBy: { startsAt: 'asc' },
    include: {
      seats: { select: { priceCents: true }, orderBy: { priceCents: 'asc' }, take: 1 },
    },
  })
}

export async function getPublishedCities(): Promise<string[]> {
  const results = await prisma.event.findMany({
    where: { published: true },
    select: { city: true },
    distinct: ['city'],
  })

  return results.map((result) => result.city)
}
