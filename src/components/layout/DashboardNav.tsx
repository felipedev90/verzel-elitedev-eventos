'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Role } from '@/generated/prisma/client'
import { LogOut } from 'lucide-react'

const ROLE_HOME: Record<Role, { href: string; label: string }> = {
  ORGANIZER: { href: '/organizer', label: 'Meus Eventos' },
  GATE: { href: '/gate', label: 'Validar Ingresso' },
  CUSTOMER: { href: '/my-tickets', label: 'Meus Ingressos' },
}

type DashboardNavProps = {
  role: Role
}

export function DashboardNav({ role }: DashboardNavProps) {
  const router = useRouter()
  const roleHome = ROLE_HOME[role]

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="border-b border-border bg-surface px-6 py-4">
      <nav className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="font-serif text-lg text-text">
          <span className="text-accent/90">Kino</span>Garten
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href={roleHome.href}
            className="text-sm text-text transition-colors duration-300 hover:text-accent"
          >
            {roleHome.label}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sair"
            className="cursor-pointer text-sm text-text transition-colors duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <LogOut className="mr-1 inline-block h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  )
}
