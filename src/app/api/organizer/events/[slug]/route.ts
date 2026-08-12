import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/server/db'
import { requireRole } from '@/server/auth/require-role'
import { internalErrorResponse } from '@/server/http/api-error'

const updateEventSchema = z.object({
  venueName: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  startsAt: z.string().datetime().optional(),
  published: z.boolean().optional(),
})

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await requireRole(['ORGANIZER', 'GATE'])
  if (!auth.ok) return auth.response

  const { slug } = await params

  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        _count: { select: { seats: true, tickets: true } },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.organizerId !== auth.session.userId && auth.session.role !== 'GATE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Failed to fetch event:', error)
    return internalErrorResponse()
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await requireRole(['ORGANIZER'])
  if (!auth.ok) return auth.response

  const { slug } = await params
  const body = await request.json()
  const parsed = updateEventSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid update data', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  try {
    const existingEvent = await prisma.event.findUnique({ where: { slug } })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (existingEvent.organizerId !== auth.session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { startsAt, ...rest } = parsed.data

    const updatedEvent = await prisma.event.update({
      where: { slug },
      data: {
        ...rest,
        ...(startsAt ? { startsAt: new Date(startsAt) } : {}),
      },
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Failed to update event:', error)
    return internalErrorResponse()
  }
}
