'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { MovieOption } from './movie-option'

type CatalogMovie = {
  externalId: string
  title: string
  posterUrl: string | null
  releaseDate: string
}

type MoviePickerProps = {
  selectedMovie: CatalogMovie | null
  onSelect: (movie: CatalogMovie) => void
}

export function MoviePicker({ selectedMovie, onSelect }: MoviePickerProps) {
  const [movies, setMovies] = useState<CatalogMovie[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadMovies() {
      try {
        const response = await fetch('/api/organizer/movies')
        if (!response.ok) {
          setError('Não foi possível carregar o catálogo de filmes.')
          return
        }
        const data = await response.json()
        setMovies(data)
      } catch {
        setError('Erro de conexão. Tente novamente.')
      }
    }

    loadMovies()
  }, [])

  if (error) {
    return (
      <p role="alert" className="text-sm text-red-400">
        {error}
      </p>
    )
  }

  if (!movies) {
    return (
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="aspect-2/3 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
      {movies.map((movie) => (
        <MovieOption
          key={movie.externalId}
          title={movie.title}
          posterUrl={movie.posterUrl}
          isSelected={selectedMovie?.externalId === movie.externalId}
          onSelect={() => onSelect(movie)}
        />
      ))}
    </div>
  )
}
