import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/server/db'
import { formatLongDate, formatPriceFromCents } from '@/lib/format'

type EventPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params

  const event = await prisma.event.findUnique({
    where: { slug, published: true },
    select: { title: true, synopsis: true, venueName: true, city: true },
  })

  if (!event) {
    return { title: 'Evento não encontrado' }
  }

  const description =
    `${event.title} em ${event.venueName}, ${event.city}. ${event.synopsis}`.slice(0, 155)

  return {
    title: event.title,
    description,
    openGraph: {
      title: event.title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description,
    },
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params

  const event = await prisma.event.findUnique({
    where: { slug, published: true },
    include: {
      seats: { orderBy: { priceCents: 'asc' }, take: 1 },
    },
  })

  if (!event) {
    notFound()
  }

  const cheapestSeat = event.seats[0]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.synopsis,
    startDate: event.startsAt.toISOString(),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.venueName,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.city,
        addressCountry: 'BR',
      },
    },
    image: [event.posterUrl],
    offers: cheapestSeat
      ? {
          '@type': 'Offer',
          price: (cheapestSeat.priceCents / 100).toFixed(2),
          priceCurrency: 'BRL',
          availability: 'https://schema.org/InStock',
          url: `https://verzel-elitedev-eventos.vercel.app/eventos/${event.slug}`,
        }
      : undefined,
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-text-muted transition-colors duration-300 hover:text-accent"
      >
        ← Voltar
      </Link>
      <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
        <div className="relative aspect-2/3 overflow-hidden rounded-md bg-surface">
          <Image
            src={event.posterUrl}
            alt={`Pôster do filme ${event.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <h1 className="mb-3 font-serif text-4xl text-text">{event.title}</h1>
          <p className="mb-1 text-text-muted">
            {event.venueName} · {event.city}
          </p>
          <p className="mb-6 text-text-muted">{formatLongDate(event.startsAt)}</p>

          {cheapestSeat && (
            <p className="mb-6 text-accent">
              Ingressos a partir de {formatPriceFromCents(cheapestSeat.priceCents)}
            </p>
          )}

          <p className="mb-8 leading-relaxed text-text">{event.synopsis}</p>

          <Link
            href={`/eventos/${event.slug}/comprar`}
            className="inline-flex items-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-bg transition-colors duration-300 hover:bg-accent-hover"
          >
            Comprar ingresso
          </Link>
        </div>
      </div>
    </main>
  )
}
