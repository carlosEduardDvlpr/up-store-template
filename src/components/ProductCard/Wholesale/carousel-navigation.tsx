import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CarouselNavigationProps {
  onPrevious: () => void
  onNext: () => void
  className?: string
}

export function CarouselNavigation({
  onPrevious,
  onNext,
  className,
}: CarouselNavigationProps) {
  return (
    <div className={cn('flex gap-2 md:gap-4', className)}>
      <button
        onClick={onPrevious}
        className="h-10 w-10 md:h-12 md:w-12 bg-white/80 backdrop-blur-sm rounded-none border-0 shadow-sm hover:bg-white/90 transition-colors flex items-center justify-center"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        onClick={onNext}
        className="h-10 w-10 md:h-12 md:w-12 bg-white/80 backdrop-blur-sm rounded-none border-0 shadow-sm hover:bg-white/90 transition-colors flex items-center justify-center"
        aria-label="Next image"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>
    </div>
  )
}
