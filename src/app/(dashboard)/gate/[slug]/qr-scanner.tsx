'use client'

import { Scanner } from '@yudiel/react-qr-scanner'
import { Button } from '@/components/ui/Button'

type QrScannerProps = {
  onScan: (code: string) => void
  onCancel: () => void
}

export function QrScanner({ onScan, onCancel }: QrScannerProps) {
  function handleScan(codes: { rawValue: string }[]) {
    const firstCode = codes[0]
    if (firstCode) {
      onScan(firstCode.rawValue)
    }
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="mx-auto aspect-square max-w-xs">
        <Scanner onScan={handleScan} />
      </div>
      <Button
        variant="ghost"
        onClick={onCancel}
        className="w-full rounded-none border-t border-border"
      >
        Cancelar leitura
      </Button>
    </div>
  )
}
