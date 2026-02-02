'use client'

import { Product } from '@/data/types/product'
import { SkeletonGrid } from './skeleton-grid'
import { ProductCard } from '@/components/ProductCard'
import { GTMViewItemListEvent, pushToDataLayer } from '@/lib/gtm'
import { Suspense, useEffect, useRef } from 'react'
import { useTokenContext } from '@/contexts/token-context'
import { motion, useInView } from 'framer-motion'
import { slideUp } from './animation'
import { COMPANY_NAME } from '@/data/constants'

interface ProductGridProps {
  products: Product[]
  categorySlug?: string
}

export function ProductGrid({ products, categorySlug }: ProductGridProps) {
  const isProductsArray = Array.isArray(products) && products.length > 0
  const { user } = useTokenContext()

  // Trigger `view_item_list` when products are available
  useEffect(() => {
    if (isProductsArray) {
      // Map over products and their SKUs to form the event data
      const viewItemListEventData: GTMViewItemListEvent = {
        event: 'view_item_list',
        dzns_id: user?.id,
        item_list_id: categorySlug || '',
        item_list_name: categorySlug || '',
        ecommerce: {
          items: products.flatMap((product) =>
            product.skus.map((sku) => ({
              item_name: product.title,
              item_id: sku.id, // Assuming SKU ID is used
              price: Number(sku.price_wholesale),
              item_brand: COMPANY_NAME, // Assuming a default brand
              item_category: product.categories?.[0]?.title || 'Unknown',
              item_variant: sku.color?.title || 'Unknown', // SKU color variant
              item_size: sku.size?.title || 'Unknown', // SKU size
            })),
          ),
        },
      }

      // Push event to GTM
      pushToDataLayer(viewItemListEventData)
    }
  }, [isProductsArray, products, categorySlug, user])

  const container = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(container)

  if (!isProductsArray) {
    return <SkeletonGrid />
  }

  return (
    <section
      aria-labelledby="product-heading"
      className="lg:col-span-2 lg:mt-0 xl:col-span-3 pt-4"
    >
      <h2 id="product-heading" className="sr-only">
        Products
      </h2>
      <div
        ref={container}
        className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-5"
      >
        <Suspense fallback={<SkeletonGrid />}>
          {products.map((product, index) => {
            return (
              <motion.div
                key={product.id}
                variants={slideUp}
                custom={index}
                animate={isInView ? 'open' : 'closed'}
              >
                <ProductCard key={product.id} product={product} />
              </motion.div>
            )
          })}
        </Suspense>
      </div>
    </section>
  )
}
