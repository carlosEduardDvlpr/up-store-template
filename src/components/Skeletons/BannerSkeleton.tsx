import { Card, CardContent } from '@/components/ui/card'

export function BannerSkeleton() {
  return (
    <div className="relative">
      <Card>
        <CardContent className="relative w-full bg-gray-200 min-h-[calc(100vh-64px)] animate-pulse" />
      </Card>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-8 h-1 bg-gray-300 rounded-full animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}
