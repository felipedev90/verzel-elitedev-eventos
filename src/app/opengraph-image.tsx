import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'KinoGarten — Sua próxima sessão começa aqui'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0e1a',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(217,154,63,0.2), transparent)',
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          color: '#f4f2ec',
          display: 'flex',
        }}
      >
        <span style={{ color: '#d99a3f' }}>Kino</span>Garten
      </div>
      <div
        style={{
          fontSize: 28,
          color: '#9ca3b8',
          marginTop: 24,
          display: 'flex',
        }}
      >
        Sua próxima sessão começa aqui
      </div>
    </div>,
    { ...size },
  )
}
