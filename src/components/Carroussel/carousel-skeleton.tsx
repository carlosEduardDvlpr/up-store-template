import { CarouselHeader } from './carousel-header'
import { CategoryProps } from '.'

interface CarouselSkeletonProps {
  category: CategoryProps
}

export function CarouselSkeleton({ category }: CarouselSkeletonProps) {
  return (
    <section aria-labelledby={`${category.title}-carousel-heading`}>
      <div className="mx-auto py-4 px-4 sm:py-24 lg:max-w-full sm:max-w-sm md:max-w-full lg:px-8 lg:py-8">
        {/* Carousel Header */}
        <CarouselHeader category={category} />

        {/* Skeleton Carousel */}
        <div className="w-full max-w-sm mx-auto md:max-w-full lg:max-w-full sm:px-6 lg:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 1 }).map((_, index) => (
              <div
                key={index}
                className="sm:basis-1/1 md:basis-1/3 lg:basis-1/5"
              >
                {/* Skeleton Card */}
                <div className="overflow-hidden border rounded-lg">
                  <div
                    className="animate-pulse p-0 bg-gray-200"
                    style={{ aspectRatio: '2 / 3' }}
                  >
                    {/* Image skeleton */}
                    <div className="h-full w-full bg-gray-300"></div>
                  </div>
                </div>

                {/* Skeleton Title */}
                <div className="mt-4 text-sm text-gray-700">
                  <div
                    className="h-4 bg-gray-300 rounded w-3/4 mb-2"
                    style={{ maxHeight: '2.4em', lineHeight: '1.2em' }}
                  ></div>

                  {/* Skeleton Colors */}
                  <h4 className="sr-only">Cores disponíveis</h4>
                  <ul role="list" className="mt-2 flex items-center space-x-3">
                    {Array.from({ length: 5 }).map((_, colorIndex) => (
                      <li
                        key={colorIndex}
                        className="h-4 w-4 rounded-full bg-gray-300 border border-black border-opacity-10"
                      ></li>
                    ))}
                    <li className="h-4 w-4 rounded-full bg-gray-300 border border-black border-opacity-10 flex items-center justify-center">
                      <span className="text-xs bg-gray-300">+</span>
                    </li>
                  </ul>

                  {/* Skeleton Price */}
                  <div className="flex justify-between items-center mt-1">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
