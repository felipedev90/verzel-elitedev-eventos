'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/Skeleton'
import { EventInfoCard } from './event-info-card'
import { EditEventForm } from './edit-event-form'
import type { EditEventInput } from './edit-event-schema'
import Link from 'next/link'
import { EventActions } from './event-actions'

type OrganizerEventDetail = {
  id: string
  slug: string
  title: string
  synopsis: string
  posterUrl: string
  venueName: string
  city: string
  startsAt: string
  published: boolean
  _count: { seats: number; tickets: number }
}

export default function OrganizerEventDetailPage() {
  const params = useParams<{ slug: string }>()
  const [event, setEvent] = useState<OrganizerEventDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isToggling, setIsToggling] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEvent() {
      try {
        const response = await fetch(`/api/organizer/events/${params.slug}`)
        if (!response.ok) {
          setError('Evento não encontrado.')
          return
        }
        const data = await response.json()
        setEvent(data)
      } catch {
        setError('Erro de conexão. Tente novamente.')
      }
    }

    loadEvent()
  }, [params.slug])

  async function handleTogglePublished() {
    if (!event) return
    setIsToggling(true)

    try {
      const response = await fetch(`/api/organizer/events/${event.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !event.published }),
      })

      if (response.ok) {
        const updated = await response.json()
        setEvent((current) => (current ? { ...current, published: updated.published } : current))
      }
    } finally {
      setIsToggling(false)
    }
  }

  async function handleSaveEdit(data: EditEventInput) {
    if (!event) return
    setEditError(null)

    try {
      const response = await fetch(`/api/organizer/events/${event.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueName: data.venueName,
          city: data.city,
          startsAt: new Date(data.startsAt).toISOString(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setEditError(result.error ?? 'Não foi possível salvar as alterações.')
        return
      }

      setEvent((current) => (current ? { ...current, ...result } : current))
      setIsEditing(false)
    } catch {
      setEditError('Erro de conexão. Tente novamente.')
    }
  }

  if (error) {
    return (
      <p role="alert" className="text-sm text-red-400">
        {error}
      </p>
    )
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl">
        <Skeleton className="mb-4 h-10 w-2/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/organizer"
        className="cursor-pointer mb-6 inline-flex items-center gap-1 text-sm text-text-muted transition-colors duration-300 hover:text-accent"
      >
        ← Meus eventos
      </Link>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl text-text">{event.title}</h1>
        <span
          className={
            event.published
              ? 'rounded-full bg-accent/20 px-3 py-1 text-xs text-accent'
              : 'rounded-full bg-border px-3 py-1 text-xs text-text-muted'
          }
        >
          {event.published ? 'Publicado' : 'Rascunho'}
        </span>
      </div>

      <div className="mb-6">
        {isEditing ? (
          <EditEventForm
            defaultValues={{
              venueName: event.venueName,
              city: event.city,
              startsAt: event.startsAt.slice(0, 16),
            }}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditing(false)}
            serverError={editError}
          />
        ) : (
          <EventInfoCard
            venueName={event.venueName}
            city={event.city}
            startsAt={event.startsAt}
            posterUrl={event.posterUrl}
            ticketsSold={event._count.tickets}
            totalSeats={event._count.seats}
          />
        )}
      </div>

      <EventActions
        isEditing={isEditing}
        isPublished={event.published}
        isToggling={isToggling}
        onEdit={() => setIsEditing(true)}
        onTogglePublished={handleTogglePublished}
      />
    </div>
  )
}
