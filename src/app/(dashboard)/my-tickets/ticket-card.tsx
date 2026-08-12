'use client'

import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { Share2, Download } from 'lucide-react'
import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { formatLongDate } from '@/lib/format'

type Ticket = {
  id: string
  holderName: string
  usedAt: Date | null
  shareToken: string
  qrCode: string
  event: {
    title: string
    venueName: string
    city: string
    startsAt: Date
    posterUrl: string
  }
  seat: {
    row: string
    number: number
    sector: string
  }
}

type TicketCardProps = {
  ticket: Ticket
}

export function TicketCard({ ticket }: TicketCardProps) {
  const [copied, setCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const captureRef = useRef<HTMLDivElement>(null)

  async function handleShare() {
    const shareUrl = `${window.location.origin}/tickets/share/${ticket.shareToken}`
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDownload() {
    if (!captureRef.current) return

    try {
      const dataUrl = await toPng(captureRef.current, {
        backgroundColor: '#1a2138',
        pixelRatio: 2,
      })

      const link = document.createElement('a')
      link.download = `ingresso-${ticket.event.title.toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setIsDownloading(false)
    }
  }

  const isUsed = Boolean(ticket.usedAt)

  return (
    <div className="rounded-md border border-border bg-surface p-2">
      <div ref={captureRef} className="flex flex-col gap-6 bg-surface p-2 sm:flex-row">
        <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-md bg-bg sm:h-40 sm:w-28">
          <Image src={ticket.event.posterUrl} alt="" fill sizes="112px" className="object-cover" />
        </div>

        <div className="flex-1">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-xl text-text">{ticket.event.title}</h3>
              <p className="text-sm text-text-muted">
                {ticket.event.venueName} · {ticket.event.city}
              </p>
              <p className="text-sm text-text-muted">{formatLongDate(ticket.event.startsAt)}</p>
            </div>

            {isUsed && (
              <span className="rounded-full bg-border px-3 py-1 text-xs text-text-muted">
                Utilizado
              </span>
            )}
          </div>

          <p className="text-sm text-text">
            Assento {ticket.seat.row}
            {ticket.seat.number} · {ticket.seat.sector}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2">
          <div className="rounded-md bg-white p-2">
            <QRCodeSVG value={ticket.qrCode} size={96} />
          </div>
          <p className="text-xs text-text-muted">Portaria</p>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-4">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Share2 size={16} aria-hidden="true" />
          {copied ? 'Link copiado!' : 'Compartilhar'}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsDownloading(true)
            handleDownload().finally(() => setIsDownloading(false))
          }}
          disabled={isDownloading}
          className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
        >
          <Download size={16} aria-hidden="true" />
          {isDownloading ? 'Baixando...' : 'Baixar'}
        </button>
      </div>
    </div>
  )
}
