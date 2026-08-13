'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type CatalogFiltersProps = {
  cities: string[]
}

export function CatalogFilters({ cities }: CatalogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const busca = formData.get('busca')?.toString().trim()
    const cidade = formData.get('cidade')?.toString()

    const params = new URLSearchParams()
    if (busca) params.set('busca', busca)
    if (cidade) params.set('cidade', cidade)

    router.push(`/?${params.toString()}#em-cartaz`)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="search"
        name="busca"
        placeholder="Buscar filme..."
        aria-label="Buscar filme"
        defaultValue={searchParams.get('busca') ?? ''}
        className="flex-1 rounded-md border border-border bg-surface px-4 py-2.5 text-text transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />

      <select
        name="cidade"
        aria-label="Filtrar por cidade"
        defaultValue={searchParams.get('cidade') ?? ''}
        className="rounded-md border border-border bg-surface px-4 py-2.5 text-text transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <option value="">Todas as cidades</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-bg transition-colors duration-300 hover:bg-accent-hover"
      >
        Buscar
      </button>
    </form>
  )
}
