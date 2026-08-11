import { SignJWT, jwtVerify } from 'jose'
import type { Role } from '@/generated/prisma/client'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const SESSION_DURATION = '7d'

export type SessionPayload = {
  userId: string
  role: Role
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ userId: payload.userId, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(JWT_SECRET)
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (typeof payload.userId !== 'string' || typeof payload.role !== 'string') {
      return null
    }
    return { userId: payload.userId, role: payload.role as Role }
  } catch {
    return null
  }
}
