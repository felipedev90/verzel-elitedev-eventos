import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { requireRole } from '@/server/auth/require-role'
import { internalErrorResponse } from '@/server/http/api-error'
import { CANCELLATION_WINDOW_MS } from '@/lib/constants'

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(['CUSTOMER'])
  if (!auth.ok) return auth.response

  const { id } = await params

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: { order: true, event: { select: { startsAt: true } } },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    if (ticket.order.userId !== auth.session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (ticket.usedAt) {
      return NextResponse.json({ error: 'Cannot cancel a used ticket' }, { status: 409 })
    }

    const timeUntilEvent = ticket.event.startsAt.getTime() - Date.now()

    if (timeUntilEvent < CANCELLATION_WINDOW_MS) {
      return NextResponse.json(
        {
          error:
            'Cancellation window has passed. Tickets can only be cancelled up to 2 hours before the event.',
        },
        { status: 409 },
      )
    }

    await prisma.ticket.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to cancel ticket:', error)
    return internalErrorResponse()
  }
}
