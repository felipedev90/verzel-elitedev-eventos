'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/cn'

const TEST_CARDS = [
  {
    label: 'Aprova o pagamento',
    number: '1234567890123456',
    variant: 'approve' as const,
  },
  {
    label: 'Recusa o pagamento',
    number: '1234567890123457',
    variant: 'decline' as const,
  },
]

export function TestCardInfo() {
  return (
    <div className="mt-6 border-t border-border pt-6">
      <p className="mb-3 text-center text-xs text-text-muted mt-6">
        Cartões para teste de fluxo de pagamento
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        {TEST_CARDS.map((card) => (
          <TestCard key={card.number} {...card} />
        ))}
      </div>
    </div>
  )
}

type TestCardProps = {
  label: string
  number: string
  variant: 'approve' | 'decline'
}

function TestCard({ label, number, variant }: TestCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(number)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formattedNumber = number.replace(/(\d{4})(?=\d)/g, '$1 ')

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'flex-1 rounded-lg border p-4 text-left transition-colors duration-300',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        variant === 'approve'
          ? 'border-accent/40 bg-accent/10 hover:border-accent'
          : 'border-red-500/30 bg-red-500/5 hover:border-red-500/60',
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={cn(
            'text-xs font-medium tracking-wide uppercase',
            variant === 'approve' ? 'text-accent' : 'text-red-400',
          )}
        >
          {label}
        </span>
        {copied ? (
          <Check size={14} className="text-accent" aria-hidden="true" />
        ) : (
          <Copy size={14} className="text-text-muted" aria-hidden="true" />
        )}
      </div>
      <p className="font-mono text-sm text-text">{formattedNumber}</p>
      <p className="mt-1 text-xs text-text-muted">{copied ? 'Copiado!' : 'Clique para copiar'}</p>
    </button>
  )
}
