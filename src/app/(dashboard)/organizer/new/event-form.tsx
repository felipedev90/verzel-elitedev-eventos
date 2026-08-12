'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { MoviePicker } from './movie-picker'
import { FormField } from './form-field'
import { eventFormSchema, type EventFormInput, type EventFormOutput } from './event-form-schema'
import Link from 'next/link'

type CatalogMovie = {
  externalId: string
  title: string
  posterUrl: string | null
  releaseDate: string
}

export function EventForm() {
  const router = useRouter()
  const [selectedMovie, setSelectedMovie] = useState<CatalogMovie | null>(null)
  const [movieError, setMovieError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormInput, unknown, EventFormOutput>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: { published: false },
  })

  async function onSubmit(data: EventFormOutput) {
    setServerError(null)
    setMovieError(null)

    if (!selectedMovie) {
      setMovieError('Selecione um filme.')
      return
    }

    try {
      const response = await fetch('/api/organizer/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          externalId: selectedMovie.externalId,
          venueName: data.venueName,
          city: data.city,
          startsAt: new Date(data.startsAt).toISOString(),
          priceCents: Math.round(data.priceCents * 100),
          published: data.published,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setServerError(result.error ?? 'Não foi possível criar o evento.')
        return
      }

      router.push(`/organizer/${result.slug}`)
      router.refresh()
    } catch {
      setServerError('Erro de conexão. Tente novamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
      <div>
        <p className="mb-3 text-sm text-text-muted">Escolha o filme</p>
        <MoviePicker selectedMovie={selectedMovie} onSelect={setSelectedMovie} />
        {movieError && (
          <p role="alert" className="mt-2 text-sm text-red-400">
            {movieError}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Local" error={errors.venueName} registration={register('venueName')} />
        <FormField label="Cidade" error={errors.city} registration={register('city')} />
        <FormField
          label="Data e hora"
          type="datetime-local"
          error={errors.startsAt}
          registration={register('startsAt')}
        />
        <FormField
          label="Preço do ingresso (R$)"
          type="number"
          step="0.01"
          error={errors.priceCents}
          registration={register('priceCents')}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-text">
        <input type="checkbox" {...register('published')} className="size-4" />
        Publicar imediatamente
      </label>

      {serverError && (
        <p role="alert" className="text-sm text-red-400">
          {serverError}
        </p>
      )}

      <div className="flex gap-3">
        <Button className="cursor-pointer w-fit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 size-4" />
              Criando...
            </>
          ) : (
            'Criar evento'
          )}
        </Button>

        <Link href="/organizer">
          <Button className="cursor-pointer" type="button" variant="ghost">
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  )
}
