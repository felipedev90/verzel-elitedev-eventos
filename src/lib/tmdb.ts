const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export function tmdbPosterUrl(path: string | null, size: 'w342' | 'w500' = 'w500') {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export function tmdbBackdropUrl(path: string | null, size: 'w780' | 'original' = 'original') {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}
