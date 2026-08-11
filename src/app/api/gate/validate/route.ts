import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { requireRole } from '@/server/auth/require-role'
import { internalErrorResponse } from '@/server/http/api-error'
import { validateTicketSchema } from '@/server/gate/schemas'
import { verifyTicketCode } from '@/server/tickets/qr-code'

export async function POST(request: Request) {
  const auth = await requireRole(['GATE'])
  if (!auth.ok) return auth.response

  const body = await request.json()
  const parsed = validateTicketSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }

  const { code, eventId } = parsed.data
  const { valid, ticketId } = verifyTicketCode(code)

  if (!valid || !ticketId) {
    return NextResponse.json({ result: 'INVALID' })
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { seat: { select: { row: true, number: true, sector: true } } },
    })

    if (!ticket) {
      return NextResponse.json({ result: 'INVALID' })
    }

    if (ticket.eventId !== eventId) {
      return NextResponse.json({ result: 'WRONG_EVENT' })
    }

    if (ticket.usedAt !== null) {
      return NextResponse.json({
        result: 'ALREADY_USED',
        usedAt: ticket.usedAt,
        holderName: ticket.holderName,
        seat: ticket.seat,
      })
    }

    const updateResult = await prisma.ticket.updateMany({
      where: { id: ticketId, usedAt: null },
      data: { usedAt: new Date(), validatedById: auth.session.userId },
    })

    if (updateResult.count === 0) {
      return NextResponse.json({ result: 'ALREADY_USED' })
    }

    return NextResponse.json({
      result: 'VALID',
      holderName: ticket.holderName,
      seat: ticket.seat,
    })
  } catch (error) {
    console.error('Ticket validation failed:', error)
    return internalErrorResponse()
  }
}
