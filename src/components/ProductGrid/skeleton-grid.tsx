export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-5 pt-12">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="group relative flex flex-col overflow-hidden bg-white"
        >
          {/* Image placeholder */}
          <div className="aspect-[3/4] h-[580px] w-auto bg-gray-200 animate-pulse"></div>

          {/* Content */}
          <div className="flex flex-1 flex-col space-y-2 py-4">
            {/* Title - 2 lines */}
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded-sm w-full animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-sm w-4/5 animate-pulse"></div>
            </div>

            {/* Price */}
            <div className="mt-2">
              <div className="h-5 rounded-none w-full animate-pulse">
                <span className="text-base font-base text-gray-500">
                  PREÇO INDISPONÍVEL
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
