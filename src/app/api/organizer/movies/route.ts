import { NextResponse } from 'next/server'
import { getNowPlayingMovies } from '@/server/tmdb/client'
import { requireRole } from '@/server/auth/require-role'

export async function GET() {
  const auth = await requireRole(['ORGANIZER'])
  if (!auth.ok) return auth.response

  try {
    const movies = await getNowPlayingMovies()
    return NextResponse.json(movies)
  } catch (error) {
    console.error('Failed to fetch movies from TMDb:', error)
    return NextResponse.json(
      { error: 'Could not load movies from catalog. Try again later.' },
      { status: 502 },
    )
  }
}
