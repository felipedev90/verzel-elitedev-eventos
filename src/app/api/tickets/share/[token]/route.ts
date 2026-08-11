import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { internalErrorResponse } from '@/server/http/api-error'

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { shareToken: token },
      include: {
        event: {
          select: { title: true, venueName: true, city: true, startsAt: true, posterUrl: true },
        },
        seat: { select: { row: true, number: true, sector: true } },
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    return NextResponse.json({
      holderName: ticket.holderName,
      usedAt: ticket.usedAt,
      event: ticket.event,
      seat: ticket.seat,
    })
  } catch (error) {
    console.error('Failed to fetch shared ticket:', error)
    return internalErrorResponse()
  }
}
