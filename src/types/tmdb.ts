export type TmdbMovie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  genre_ids: number[]
}

export type TmdbMovieListResponse = {
  page: number
  results: TmdbMovie[]
  total_pages: number
  total_results: number
}
