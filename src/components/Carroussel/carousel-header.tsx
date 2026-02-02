import Link from 'next/link'
import { CategoryProps } from '.'

interface CarouselHeaderProps {
  category: CategoryProps
}

export function CarouselHeader({ category }: CarouselHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 md:px-5 lg:px-4">
      <h2
        id="favorites-heading"
        className="text-[20px] font-base text-gray-900 pb-6"
      >
        {category.title.toUpperCase()}
      </h2>
      <Link
        href={'/search'}
        className="hidden text-sm font-base text-gray-600 hover:text-gray-900 md:block"
      >
        Todos os produtos
        <span aria-hidden="true"> &rarr;</span>
      </Link>
    </div>
  )
}
