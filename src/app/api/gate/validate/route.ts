import { NextResponse } from 'next/server'
import { requireRole } from '@/server/auth/require-role'
import { internalErrorResponse } from '@/server/http/api-error'
import { validateTicketSchema } from '@/server/gate/schemas'
import { validateTicket } from '@/server/gate/validate-ticket'

export async function POST(request: Request) {
  const auth = await requireRole(['GATE'])
  if (!auth.ok) return auth.response

  const body = await request.json()
  const parsed = validateTicketSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }

  const { code, eventId } = parsed.data

  try {
    const result = await validateTicket(code, eventId, auth.session.userId)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Ticket validation failed:', error)
    return internalErrorResponse()
  }
}
