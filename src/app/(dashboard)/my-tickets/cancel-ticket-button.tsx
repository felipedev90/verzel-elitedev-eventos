'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ban } from 'lucide-react'

type CancelTicketButtonProps = {
  ticketId: string
}

export function CancelTicketButton({ ticketId }: CancelTicketButtonProps) {
  const router = useRouter()
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCancel() {
    const confirmed = window.confirm('Cancelar este ingresso? Essa ação não pode ser desfeita.')
    if (!confirmed) return

    setIsCancelling(true)
    setError(null)

    try {
      const response = await fetch(`/api/customer/tickets/${ticketId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error ?? 'Não foi possível cancelar o ingresso.')
        return
      }

      router.refresh()
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCancel}
        disabled={isCancelling}
        className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors duration-300 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
      >
        <Ban size={16} aria-hidden="true" />
        {isCancelling ? 'Cancelando...' : 'Cancelar'}
      </button>
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
