import { CatalogFilters } from './catalog-filters'
import { EventCard } from './event-card'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { Event, Seat } from '@/generated/prisma/client'

type CatalogSectionProps = {
  events: (Event & { seats: Pick<Seat, 'priceCents'>[] })[]
  cities: string[]
}

export function CatalogSection({ events, cities }: CatalogSectionProps) {
  return (
    <section id="em-cartaz" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-8 font-serif text-3xl text-text">Em cartaz</h2>

      <CatalogFilters cities={cities} />

      {events.length === 0 ? (
        <p className="py-12 text-center text-text-muted">
          Nenhum evento encontrado com esses filtros.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          {events.map((event, index) => (
            <RevealOnScroll key={event.id} delay={index * 0.05}>
              <EventCard event={event} priority={index < 4} />
            </RevealOnScroll>
          ))}
        </div>
      )}
    </section>
  )
}
