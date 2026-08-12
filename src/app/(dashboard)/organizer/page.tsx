'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { OrganizerEventCard } from './organizer-event-card'

type OrganizerEvent = {
  id: string
  slug: string
  title: string
  venueName: string
  city: string
  startsAt: string
  published: boolean
  _count: { seats: number; tickets: number }
}

export default function OrganizerPage() {
  const [events, setEvents] = useState<OrganizerEvent[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch('/api/organizer/events')
        if (!response.ok) {
          setError('Não foi possível carregar seus eventos.')
          return
        }
        const data = await response.json()
        setEvents(data)
      } catch {
        setError('Erro de conexão. Tente novamente.')
      }
    }

    loadEvents()
  }, [])

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl text-text">Meus eventos</h1>
        <Link href="/organizer/new">
          <Button className="cursor-pointer">Criar evento</Button>
        </Link>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      {!events && !error && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {events && events.length === 0 && (
        <p className="text-text-muted">Você ainda não criou nenhum evento.</p>
      )}

      {events && events.length > 0 && (
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <OrganizerEventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
