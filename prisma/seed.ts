import { prisma } from '@/server/db'
import { hashPassword } from '@/server/auth/password'
import { getMovieById } from '@/server/tmdb/client'

const SEED_PASSWORD = 'senha123'

const SEED_EVENTS = [
  {
    externalId: '969681',
    slug: 'homem-aranha-um-novo-dia',
    venueName: 'Cinema Central',
    city: 'Jundiaí',
    startsAt: new Date('2026-09-15T19:30:00'),
  },
  {
    externalId: '1108427',
    slug: 'moana',
    venueName: 'Cinema Jundiaí Shopping',
    city: 'Jundiaí',
    startsAt: new Date('2026-09-20T20:00:00'),
  },
  {
    externalId: '1084244',
    slug: 'toy-story-5',
    venueName: 'Cinema Central',
    city: 'Jundiaí',
    startsAt: new Date('2026-10-01T18:00:00'),
  },
]

async function main() {
  const passwordHash = await hashPassword(SEED_PASSWORD)

  const organizer = await prisma.user.upsert({
    where: { email: 'organizador@eventos.com' },
    update: {},
    create: {
      name: 'Ana Organizadora',
      email: 'organizador@eventos.com',
      passwordHash,
      role: 'ORGANIZER',
    },
  })

  await prisma.user.upsert({
    where: { email: 'cliente1@eventos.com' },
    update: {},
    create: {
      name: 'Bruno Cliente',
      email: 'cliente1@eventos.com',
      passwordHash,
      role: 'CUSTOMER',
    },
  })

  await prisma.user.upsert({
    where: { email: 'cliente2@eventos.com' },
    update: {},
    create: {
      name: 'Carla Cliente',
      email: 'cliente2@eventos.com',
      passwordHash,
      role: 'CUSTOMER',
    },
  })

  await prisma.user.upsert({
    where: { email: 'portaria@eventos.com' },
    update: {},
    create: {
      name: 'Diego Portaria',
      email: 'portaria@eventos.com',
      passwordHash,
      role: 'GATE',
    },
  })

  for (const seedEvent of SEED_EVENTS) {
    const movie = await getMovieById(seedEvent.externalId)

    const event = await prisma.event.upsert({
      where: { slug: seedEvent.slug },
      update: {},
      create: {
        slug: seedEvent.slug,
        title: movie.title,
        synopsis: movie.synopsis,
        posterUrl: movie.posterUrl ?? '',
        backdropUrl: movie.backdropUrl ?? '',
        externalId: movie.externalId,
        externalSource: 'tmdb',
        venueName: seedEvent.venueName,
        city: seedEvent.city,
        startsAt: seedEvent.startsAt,
        published: true,
        organizerId: organizer.id,
      },
    })

    const existingSeats = await prisma.seat.count({ where: { eventId: event.id } })

    if (existingSeats === 0) {
      const rows = ['A', 'B', 'C']
      const seatsData = rows.flatMap((row) =>
        Array.from({ length: 8 }, (_, index) => ({
          eventId: event.id,
          sector: 'Plateia',
          row,
          number: index + 1,
          priceCents: 3500,
        })),
      )

      await prisma.seat.createMany({ data: seatsData })
    }
  }

  console.log('Seed concluído:')
  console.log('  organizador@eventos.com / senha123')
  console.log('  cliente1@eventos.com / senha123')
  console.log('  cliente2@eventos.com / senha123')
  console.log('  portaria@eventos.com / senha123')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
