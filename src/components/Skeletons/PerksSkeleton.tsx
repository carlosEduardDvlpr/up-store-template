export function PerksSkeleton() {
  return (
    <section
      aria-labelledby="perks-heading"
      className="border-t border-gray-200 bg-gray-50"
    >
      <h2 id="perks-heading" className="sr-only">
        Por que Dznes?
      </h2>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
            >
              <div className="md:flex-shrink-0">
                <div className="flow-root">
                  <div className="mx-auto h-24 w-24 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                <div className="h-5 w-32 bg-gray-200 rounded mx-auto animate-pulse" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
