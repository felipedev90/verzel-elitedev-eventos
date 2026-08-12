import { ImageResponse } from 'next/og'
import { prisma } from '@/server/db'

export const alt = 'Pôster do evento'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type OpengraphImageProps = {
  params: { slug: string }
}

export default async function OpengraphImage({ params }: OpengraphImageProps) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug, published: true },
    select: { title: true, venueName: true, city: true, posterUrl: true },
  })

  if (!event) {
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0e1a',
          color: '#f4f2ec',
          fontSize: 64,
        }}
      >
        KinoGarten
      </div>,
      { ...size },
    )
  }

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: '#0a0e1a',
      }}
    >
      <div
        style={{
          width: 420,
          height: '100%',
          display: 'flex',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.posterUrl}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 60px',
        }}
      >
        <div style={{ fontSize: 20, color: '#d99a3f', display: 'flex', marginBottom: 16 }}>
          KINOGARTEN
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: '#f4f2ec',
            display: 'flex',
            lineHeight: 1.1,
          }}
        >
          {event.title}
        </div>
        <div style={{ fontSize: 24, color: '#9ca3b8', display: 'flex', marginTop: 20 }}>
          {event.venueName} · {event.city}
        </div>
      </div>
    </div>,
    { ...size },
  )
}
