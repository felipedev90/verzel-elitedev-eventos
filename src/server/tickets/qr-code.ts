import { createHmac, timingSafeEqual } from 'node:crypto'

const TICKET_SECRET = process.env.TICKET_SECRET ?? ''

function sign(ticketId: string): string {
  return createHmac('sha256', TICKET_SECRET).update(ticketId).digest('hex')
}

export function generateTicketCode(ticketId: string): string {
  const signature = sign(ticketId)
  return `${ticketId}.${signature}`
}

export function verifyTicketCode(code: string): { valid: boolean; ticketId: string | null } {
  const separatorIndex = code.lastIndexOf('.')

  if (separatorIndex === -1) {
    return { valid: false, ticketId: null }
  }

  const ticketId = code.slice(0, separatorIndex)
  const providedSignature = code.slice(separatorIndex + 1)
  const expectedSignature = sign(ticketId)

  const providedBuffer = Buffer.from(providedSignature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (providedBuffer.length !== expectedBuffer.length) {
    return { valid: false, ticketId: null }
  }

  const signaturesMatch = timingSafeEqual(providedBuffer, expectedBuffer)

  return signaturesMatch ? { valid: true, ticketId } : { valid: false, ticketId: null }
}
