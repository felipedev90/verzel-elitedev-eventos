import Link from 'next/link'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/server/auth/session'

const ROLE_LINK: Record<string, { href: string; label: string }> = {
  ORGANIZER: { href: '/organizer', label: 'Meus Eventos' },
  GATE: { href: '/gate', label: 'Validar Ingresso' },
  CUSTOMER: { href: '/my-tickets', label: 'Meus Ingressos' },
}

export async function Navbar() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  const session = token ? await verifySessionToken(token) : null
  const roleLink = session ? ROLE_LINK[session.role] : null

  return (
    <header className="fixed inset-x-4 top-4 z-50 mx-auto max-w-5xl rounded-full border border-border bg-surface/70 px-6 py-3 backdrop-blur-md">
      <nav className="flex items-center justify-between">
        <Link href="/" className="font-serif text-lg text-text">
          <span className="text-accent/90">Kino</span>Garten
        </Link>

        <div className="flex items-center gap-6">
          {roleLink ? (
            <Link
              href={roleLink.href}
              className="text-sm text-text transition-colors duration-300 hover:text-accent"
            >
              {roleLink.label}
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm text-text transition-colors duration-300 hover:text-accent"
            >
              Entrar
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
