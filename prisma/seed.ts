import { prisma } from '@/server/db'
import { hashPassword } from '@/server/auth/password'

const SEED_PASSWORD = 'senha123'

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

  const event = await prisma.event.upsert({
    where: { slug: 'homem-aranha-um-novo-dia' },
    update: {},
    create: {
      slug: 'homem-aranha-um-novo-dia',
      title: 'Homem-Aranha: Um Novo Dia',
      synopsis:
        'É um novo dia para Peter Parker. Combatendo o crime em tempo integral como Homem-Aranha em um mundo que não se lembra mais dele.',
      posterUrl: 'https://image.tmdb.org/t/p/w500/x0nvYzQpyJc5pdT9lMnkMuYAg0O.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/w780/qeQJx07rK2xm8SD2sJxFKhE7gs0.jpg',
      externalId: '969681',
      externalSource: 'tmdb',
      venueName: 'Cinema Central',
      city: 'Jundiaí',
      startsAt: new Date('2026-09-15T19:30:00'),
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
