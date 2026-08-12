'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

type CarouselProps = {
  slideCount: number
  children: React.ReactNode
}

export function Carousel({ slideCount, children }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: true }),
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  return (
    <div className="relative h-full">
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">{children}</div>
      </div>

      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Slide anterior"
            className="absolute top-1/2 left-4 hidden -translate-y-1/2 rounded-full border border-border bg-surface/70 p-2 text-text backdrop-blur-md transition-colors duration-300 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:block"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Próximo slide"
            className="absolute top-1/2 right-4 hidden -translate-y-1/2 rounded-full border border-border bg-surface/70 p-2 text-text backdrop-blur-md transition-colors duration-300 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:block"
          >
            <ChevronRightIcon />
          </button>

          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
            {Array.from({ length: slideCount }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={`Ir para slide ${index + 1}`}
                aria-current={index === selectedIndex}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  index === selectedIndex ? 'w-6 bg-accent' : 'w-1.5 bg-text-muted/50',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
