import { prisma } from '@/server/db'
import { generateTicketCode } from '@/server/tickets/qr-code'

export async function getCustomerTickets(userId: string) {
  const tickets = await prisma.ticket.findMany({
    where: { order: { userId, status: 'PAID' } },
    include: {
      event: {
        select: { title: true, venueName: true, city: true, startsAt: true, posterUrl: true },
      },
      seat: { select: { row: true, number: true, sector: true } },
    },
    orderBy: { event: { startsAt: 'asc' } },
  })

  return tickets.map((ticket) => ({
    id: ticket.id,
    holderName: ticket.holderName,
    usedAt: ticket.usedAt,
    shareToken: ticket.shareToken,
    qrCode: generateTicketCode(ticket.id),
    event: ticket.event,
    seat: ticket.seat,
  }))
}
