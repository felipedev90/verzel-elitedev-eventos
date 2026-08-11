import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { requireRole } from '@/server/auth/require-role'
import { internalErrorResponse } from '@/server/http/api-error'
import { generateTicketCode } from '@/server/tickets/qr-code'

export async function GET() {
  const auth = await requireRole(['CUSTOMER'])
  if (!auth.ok) return auth.response

  try {
    const tickets = await prisma.ticket.findMany({
      where: { order: { userId: auth.session.userId, status: 'PAID' } },
      include: {
        event: {
          select: { title: true, venueName: true, city: true, startsAt: true, posterUrl: true },
        },
        seat: { select: { row: true, number: true, sector: true } },
      },
      orderBy: { event: { startsAt: 'asc' } },
    })

    const ticketsWithCode = tickets.map((ticket) => ({
      id: ticket.id,
      holderName: ticket.holderName,
      usedAt: ticket.usedAt,
      shareToken: ticket.shareToken,
      qrCode: generateTicketCode(ticket.id),
      event: ticket.event,
      seat: ticket.seat,
    }))

    return NextResponse.json(ticketsWithCode)
  } catch (error) {
    console.error('Failed to list customer tickets:', error)
    return internalErrorResponse()
  }
}
