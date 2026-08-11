import type { TmdbMovie, TmdbMovieListResponse } from '@/types/tmdb'
import type { CatalogMovie } from '@/types/catalog'
import { tmdbPosterUrl, tmdbBackdropUrl } from '@/lib/tmdb'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

function toCatalogMovie(raw: TmdbMovie): CatalogMovie {
  return {
    externalId: String(raw.id),
    title: raw.title,
    synopsis: raw.overview,
    posterUrl: tmdbPosterUrl(raw.poster_path),
    backdropUrl: tmdbBackdropUrl(raw.backdrop_path),
    releaseDate: raw.release_date,
  }
}

export class TmdbError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly path: string,
  ) {
    super(message)
    this.name = 'TmdbError'
  }
}

async function tmdbFetch<T>(path: string): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  let response: Response
  try {
    response = await fetch(`${TMDB_BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        Accept: 'application/json',
      },
      signal: controller.signal,
    })
  } catch {
    throw new TmdbError('Network error reaching TMDb', 0, path)
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    throw new TmdbError(`TMDb request failed: ${response.status}`, response.status, path)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new TmdbError('TMDb returned invalid JSON', response.status, path)
  }
}

export async function getNowPlayingMovies(): Promise<CatalogMovie[]> {
  const data = await tmdbFetch<TmdbMovieListResponse>('/movie/now_playing?language=pt-BR&page=1')
  return data.results.map(toCatalogMovie)
}

export async function getMovieById(id: string): Promise<CatalogMovie> {
  const raw = await tmdbFetch<TmdbMovie>(`/movie/${id}?language=pt-BR`)
  return toCatalogMovie(raw)
}
