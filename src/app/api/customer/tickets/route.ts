import { NextResponse } from 'next/server'
import { requireRole } from '@/server/auth/require-role'
import { internalErrorResponse } from '@/server/http/api-error'
import { getCustomerTickets } from '@/server/tickets/queries'

export async function GET() {
  const auth = await requireRole(['CUSTOMER'])
  if (!auth.ok) return auth.response

  try {
    const tickets = await getCustomerTickets(auth.session.userId)
    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Failed to list customer tickets:', error)
    return internalErrorResponse()
  }
}
