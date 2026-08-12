import Image from 'next/image'
import Link from 'next/link'
import type { Event } from '@/generated/prisma/client'
import { Carousel } from '@/components/ui/Carousel'
import { formatLongDate } from '@/lib/format'

type HeroProps = {
  events: Event[]
}

export function Hero({ events }: HeroProps) {
  if (events.length === 0) {
    return (
      <section className="flex h-[70vh] min-h-125 items-center justify-center border-b border-border">
        <p className="text-text-muted">Nenhum evento em cartaz no momento.</p>
      </section>
    )
  }

  return (
    <section className="relative h-[85vh] min-h-150 overflow-hidden">
      <Carousel slideCount={events.length}>
        {events.map((event, index) => (
          <div key={event.id} className="relative min-w-0 flex-[0_0_100%]">
            <Image
              src={event.backdropUrl}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-top"
            />

            <div
              className="absolute inset-0 bg-linear-to-t from-bg via-bg/70 to-bg/10"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-linear-to-r from-bg/60 via-transparent to-transparent"
              aria-hidden="true"
            />

            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-6 pb-24">
              <span className="mb-4 inline-block rounded-full border border-accent px-3 py-1 text-xs tracking-wide text-accent uppercase">
                Em cartaz
              </span>
              <h1 className="mb-3 max-w-2xl font-serif text-5xl leading-tight text-text md:text-6xl">
                {event.title}
              </h1>
              <p className="mb-8 text-sm text-text-muted">
                {event.venueName} · {event.city} · {formatLongDate(event.startsAt)}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/eventos/${event.slug}`}
                  className="inline-flex items-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-bg transition-colors duration-300 hover:bg-accent-hover"
                >
                  Comprar ingresso
                </Link>
                <a
                  href="#em-cartaz"
                  className="inline-flex items-center rounded-md border border-border px-6 py-3 text-sm font-medium text-text transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  Ver todos
                </a>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  )
}
