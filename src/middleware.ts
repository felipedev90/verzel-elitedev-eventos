import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionToken } from '@/server/auth/session'

const ROLE_HOME: Record<string, string> = {
  ORGANIZER: '/organizer',
  GATE: '/gate',
  CUSTOMER: '/',
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value
  const session = token ? await verifySessionToken(token) : null

  const isLoginRoute = pathname === '/login'
  const isOrganizerRoute = pathname.startsWith('/organizer')
  const isGateRoute = pathname.startsWith('/gate')

  if (isLoginRoute) {
    if (session) {
      return NextResponse.redirect(new URL(ROLE_HOME[session.role] ?? '/', request.url))
    }
    return NextResponse.next()
  }

  if (isOrganizerRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (session.role !== 'ORGANIZER') {
      return NextResponse.redirect(new URL(ROLE_HOME[session.role] ?? '/', request.url))
    }
  }

  if (isGateRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (session.role !== 'GATE') {
      return NextResponse.redirect(new URL(ROLE_HOME[session.role] ?? '/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/organizer/:path*', '/gate/:path*'],
}
