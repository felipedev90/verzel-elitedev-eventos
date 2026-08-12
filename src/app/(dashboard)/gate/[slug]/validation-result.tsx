import { CheckCircle2, XCircle, AlertTriangle, Ban } from 'lucide-react'

type ValidationResultData = {
  result: 'VALID' | 'INVALID' | 'ALREADY_USED' | 'WRONG_EVENT'
  holderName?: string
  seat?: { row: string; number: number; sector: string }
}

type ValidationResultProps = {
  data: ValidationResultData
}

const RESULT_CONFIG = {
  VALID: {
    icon: CheckCircle2,
    label: 'Ingresso válido',
    className: 'border-green-500/50 bg-green-500/10 text-green-400',
  },
  INVALID: {
    icon: XCircle,
    label: 'Código inválido',
    className: 'border-red-500/50 bg-red-500/10 text-red-400',
  },
  ALREADY_USED: {
    icon: AlertTriangle,
    label: 'Ingresso já utilizado',
    className: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
  },
  WRONG_EVENT: {
    icon: Ban,
    label: 'Ingresso de outro evento',
    className: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
  },
}

export function ValidationResult({ data }: ValidationResultProps) {
  const config = RESULT_CONFIG[data.result]
  const Icon = config.icon

  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-md border p-8 text-center ${config.className}`}
    >
      <Icon size={48} aria-hidden="true" />
      <p className="text-xl font-medium">{config.label}</p>
      {data.holderName && (
        <p className="text-sm">
          {data.holderName}
          {data.seat && ` · Assento ${data.seat.row}${data.seat.number}`}
        </p>
      )}
    </div>
  )
}
