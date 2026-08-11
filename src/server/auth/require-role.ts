import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifySessionToken, type SessionPayload } from '@/server/auth/session'
import type { Role } from '@/generated/prisma/client'

type RequireRoleResult =
  | { ok: true; session: SessionPayload }
  | { ok: false; response: NextResponse }

export async function requireRole(allowedRoles: Role[]): Promise<RequireRoleResult> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }),
    }
  }

  const session = await verifySessionToken(token)

  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }),
    }
  }

  if (!allowedRoles.includes(session.role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    }
  }

  return { ok: true, session }
}
