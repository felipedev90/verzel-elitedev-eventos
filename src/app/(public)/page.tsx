import { prisma } from '@/server/db'
import { Hero } from './hero'

export default async function HomePage() {
  const featuredEvents = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startsAt: 'asc' },
    take: 5,
  })

  return (
    <main>
      <Hero events={featuredEvents} />
    </main>
  )
}
