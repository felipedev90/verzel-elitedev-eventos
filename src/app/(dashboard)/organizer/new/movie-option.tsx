import Image from 'next/image'
import { cn } from '@/lib/cn'

type MovieOptionProps = {
  title: string
  posterUrl: string | null
  isSelected: boolean
  onSelect: () => void
}

export function MovieOption({ title, posterUrl, isSelected, onSelect }: MovieOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      aria-label={`Selecionar ${title}`}
      className={cn(
        'relative aspect-2/3 overflow-hidden rounded-md border-2 transition-colors duration-300',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        isSelected ? 'border-accent' : 'border-transparent hover:border-border',
      )}
    >
      {posterUrl && (
        <Image src={posterUrl} alt={title} fill sizes="120px" className="object-cover" />
      )}
    </button>
  )
}
