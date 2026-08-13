import { prisma } from '@/server/db'
import { verifyTicketCode } from '@/server/tickets/qr-code'

export type ValidationResult =
  | { result: 'INVALID' }
  | { result: 'WRONG_EVENT' }
  | {
      result: 'ALREADY_USED'
      usedAt?: Date
      holderName?: string
      seat?: { row: string; number: number; sector: string }
    }
  | { result: 'VALID'; holderName: string; seat: { row: string; number: number; sector: string } }

export async function validateTicket(
  code: string,
  eventId: string,
  validatedById: string,
): Promise<ValidationResult> {
  const { valid, ticketId } = verifyTicketCode(code)

  if (!valid || !ticketId) {
    return { result: 'INVALID' }
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { seat: { select: { row: true, number: true, sector: true } } },
  })

  if (!ticket) {
    return { result: 'INVALID' }
  }

  if (ticket.eventId !== eventId) {
    return { result: 'WRONG_EVENT' }
  }

  if (ticket.usedAt !== null) {
    return {
      result: 'ALREADY_USED',
      usedAt: ticket.usedAt,
      holderName: ticket.holderName,
      seat: ticket.seat,
    }
  }

  const updateResult = await prisma.ticket.updateMany({
    where: { id: ticketId, usedAt: null },
    data: { usedAt: new Date(), validatedById },
  })

  if (updateResult.count === 0) {
    return { result: 'ALREADY_USED' }
  }

  return {
    result: 'VALID',
    holderName: ticket.holderName,
    seat: ticket.seat,
  }
}
