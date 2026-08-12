import { cn } from '@/lib/cn'

type SeatButtonProps = {
  row: string
  number: number
  isOccupied: boolean
  isSelected: boolean
  onToggle: () => void
}

export function SeatButton({ row, number, isOccupied, isSelected, onToggle }: SeatButtonProps) {
  const status = isOccupied ? 'ocupado' : isSelected ? 'selecionado' : 'disponível'

  return (
    <button
      type="button"
      disabled={isOccupied}
      onClick={onToggle}
      aria-label={`Assento ${row}${number}, ${status}`}
      aria-pressed={isSelected}
      className={cn(
        'flex size-9 items-center justify-center rounded-md border text-xs transition-colors duration-300',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        isOccupied && 'cursor-not-allowed border-border/50 text-text-muted/40',
        !isOccupied &&
          !isSelected &&
          'border-border text-text-muted hover:border-accent hover:text-accent',
        isSelected && 'border-accent bg-accent text-bg',
      )}
    >
      {number}
    </button>
  )
}
