import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { requireRole } from '@/server/auth/require-role'
import { createEventSchema } from '@/server/events/schemas'
import { getMovieById } from '@/server/tmdb/client'
import { internalErrorResponse } from '@/server/http/api-error'

const SEAT_ROWS = ['A', 'B', 'C']
const SEATS_PER_ROW = 8

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function GET() {
  const auth = await requireRole(['ORGANIZER'])
  if (!auth.ok) return auth.response

  try {
    const events = await prisma.event.findMany({
      where: { organizerId: auth.session.userId },
      orderBy: { startsAt: 'asc' },
      include: {
        _count: { select: { seats: true, tickets: true } },
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Failed to list organizer events:', error)
    return internalErrorResponse()
  }
}

export async function POST(request: Request) {
  const auth = await requireRole(['ORGANIZER'])
  if (!auth.ok) return auth.response

  const body = await request.json()
  const parsed = createEventSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid event data', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { externalId, venueName, city, startsAt, priceCents, published } = parsed.data

  let movie
  try {
    movie = await getMovieById(externalId)
  } catch (error) {
    console.error('Failed to fetch movie from TMDb:', error)
    return NextResponse.json(
      { error: 'Could not load movie details. Try again later.' },
      { status: 502 },
    )
  }

  const baseSlug = slugify(movie.title)
  const slug = `${baseSlug}-${Date.now()}`

  try {
    const event = await prisma.$transaction(async (tx) => {
      const createdEvent = await tx.event.create({
        data: {
          slug,
          title: movie.title,
          synopsis: movie.synopsis,
          posterUrl: movie.posterUrl ?? '',
          backdropUrl: movie.backdropUrl ?? '',
          externalId: movie.externalId,
          externalSource: 'tmdb',
          venueName,
          city,
          startsAt: new Date(startsAt),
          published,
          organizerId: auth.session.userId,
        },
      })

      const seatsData = SEAT_ROWS.flatMap((row) =>
        Array.from({ length: SEATS_PER_ROW }, (_, index) => ({
          eventId: createdEvent.id,
          sector: 'Plateia',
          row,
          number: index + 1,
          priceCents,
        })),
      )

      await tx.seat.createMany({ data: seatsData })

      return createdEvent
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Failed to create event:', error)
    return internalErrorResponse()
  }
}
