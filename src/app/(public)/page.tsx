import type { Metadata } from 'next'
import { getFeaturedEvents, getCatalogEvents, getPublishedCities } from '@/server/events/queries'
import { Hero } from './hero'
import { CatalogSection } from './catalog-section'

export const metadata: Metadata = {
  title: 'Filmes em cartaz e ingressos online',
  description:
    'Descubra os filmes em cartaz, escolha seu assento e compre seu ingresso online no KinoGarten.',
}

type HomePageProps = {
  searchParams: Promise<{ busca?: string; cidade?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { busca, cidade } = await searchParams

  const [featuredEvents, filteredEvents, cities] = await Promise.all([
    getFeaturedEvents(),
    getCatalogEvents({ search: busca, city: cidade }),
    getPublishedCities(),
  ])

  return (
    <main>
      <Hero events={featuredEvents} />
      <CatalogSection events={filteredEvents} cities={cities} />
    </main>
  )
}
