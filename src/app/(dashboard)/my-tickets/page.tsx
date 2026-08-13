import Link from 'next/link'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/server/auth/session'
import { getCustomerTickets } from '@/server/tickets/queries'
import { TicketCard } from './ticket-card'
import { ArrowLeft } from 'lucide-react'

export default async function MyTicketsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  const session = token ? await verifySessionToken(token) : null

  const tickets = session ? await getCustomerTickets(session.userId) : []

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-muted transition-colors duration-300 hover:text-accent"
      >
        <ArrowLeft className="mr-1 inline-block h-4 w-4" aria-hidden="true" /> Voltar
      </Link>

      <h1 className="mb-8 font-serif text-3xl text-text">Meus ingressos</h1>

      {tickets.length === 0 && (
        <p className="text-text-muted">Você ainda não comprou nenhum ingresso.</p>
      )}

      {tickets.length > 0 && (
        <div className="flex flex-col gap-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  )
}
