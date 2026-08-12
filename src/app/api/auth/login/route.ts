import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { verifyPassword } from '@/server/auth/password'
import { createSessionToken } from '@/server/auth/session'
import { internalErrorResponse } from '@/server/http/api-error'
import { checkRateLimit } from '@/server/auth/rate-limit'
import { loginSchema } from '@/server/auth/schemas'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const rateLimit = checkRateLimit(ip)

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in a minute.' },
      { status: 429 },
    )
  }

  const body = await request.json()
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
  }

  const { email, password } = parsed.data

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash)

    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createSessionToken({ userId: user.id, role: user.role })

    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return internalErrorResponse()
  }
}
