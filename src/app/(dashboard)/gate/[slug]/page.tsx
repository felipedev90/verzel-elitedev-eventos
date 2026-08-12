'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ValidationResult } from './validation-result'
import { ManualCodeForm } from './manual-code-form'
import { QrScanner } from './qr-scanner'
import { ArrowLeft } from 'lucide-react'

type ValidationData = {
  result: 'VALID' | 'INVALID' | 'ALREADY_USED' | 'WRONG_EVENT'
  holderName?: string
  seat?: { row: string; number: number; sector: string }
}

type EventInfo = {
  id: string
  title: string
}

export default function GateValidatePage() {
  const params = useParams<{ slug: string }>()
  const [event, setEvent] = useState<EventInfo | null>(null)
  const [validation, setValidation] = useState<ValidationData | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEvent() {
      try {
        const response = await fetch(`/api/organizer/events/${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          setEvent({ id: data.id, title: data.title })
        } else {
          setEvent({ id: '', title: '' })
        }
      } catch {
        setEvent({ id: '', title: '' })
      }
    }

    loadEvent()
  }, [params.slug])

  async function validateCode(code: string) {
    if (!event) return
    setIsCameraActive(false)
    setIsValidating(true)
    setError(null)
    setValidation(null)

    try {
      const response = await fetch('/api/gate/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, eventId: event.id }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error ?? 'Não foi possível validar o ingresso.')
        return
      }

      setValidation(result)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <Link
        href="/gate"
        className="mb-6 inline-flex items-center gap-1 text-sm text-text-muted transition-colors duration-300 hover:text-accent"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Trocar evento
      </Link>

      <h1 className="mb-1 font-serif text-2xl text-text  text-center">Validar ingresso</h1>
      <p className="mb-8 text-sm text-text-muted  text-center">{event?.title}</p>

      {validation && (
        <div className="mb-6">
          <ValidationResult data={validation} />
          <Button variant="ghost" onClick={() => setValidation(null)} className="mt-4 w-full">
            Validar outro ingresso
          </Button>
        </div>
      )}

      {!validation && (
        <div className="flex flex-col items-center">
          {isCameraActive ? (
            <div className="mb-6">
              <QrScanner onScan={validateCode} onCancel={() => setIsCameraActive(false)} />
            </div>
          ) : (
            <Button
              onClick={() => setIsCameraActive(true)}
              className="mb-6 w-full px-6 py-3"
              disabled={isValidating}
            >
              Ler QR code pela câmera
            </Button>
          )}

          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-text-muted">ou digite o código</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <ManualCodeForm onValidate={validateCode} isValidating={isValidating} />

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
