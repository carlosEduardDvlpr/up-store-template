export function PromotionSkeleton() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="relative isolate overflow-hidden">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-12 w-64 bg-gray-200 rounded animate-pulse mb-6" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mb-8" />
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-gray-200 to-gray-300 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
          </div>
        </div>
      </div>
    </section>
  )
}
