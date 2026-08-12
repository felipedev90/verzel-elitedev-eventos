import Image from 'next/image'
import { cn } from '@/lib/cn'

type EventPosterProps = {
  src: string
  alt: string
  priority?: boolean
  className?: string
}

export function EventPoster({ src, alt, priority = false, className }: EventPosterProps) {
  return (
    <div className={cn('relative aspect-2/3 overflow-hidden rounded-md bg-surface', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        className="object-cover"
      />
    </div>
  )
}
