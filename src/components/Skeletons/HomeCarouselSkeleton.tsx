import { Card, CardContent } from '@/components/ui/card'
import { CategoryProps } from '@/components/Carroussel'

interface HomeCarouselSkeletonProps {
  category: CategoryProps
}

export function HomeCarouselSkeleton({ category }: HomeCarouselSkeletonProps) {
  return (
    <section aria-labelledby={`${category.title}-carousel-heading`}>
      <div className="mx-auto py-9 px-6 lg:py-12 lg:pt-0 lg:pl-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-base uppercase tracking-tight text-gray-900">
            {category.title}
          </h2>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="overflow-hidden border-0 rounded-none">
              <CardContent className="p-0" style={{ aspectRatio: '2 / 3' }}>
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
