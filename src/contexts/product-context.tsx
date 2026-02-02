'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Product } from '@/data/types/product'
import { Size } from '@/data/types/sizes'
import { Sku } from '@/data/types/sku'
import { Color } from '@/data/types/colors'
import {
  GTMSelectItemEvent,
  GTMViewItemEvent,
  pushToDataLayer,
} from '@/lib/gtm'
import { useTokenContext } from './token-context'
import { COMPANY_NAME } from '@/data/constants'

interface ProductContextType {
  selectedColor: Color
  selectedSize: Size | null
  skusWithSelectedColor: Sku[]
  skuWithMostImages: Sku | undefined
  selectedSku: Sku | null
  handleColorChange: (newColor: Color) => void
  handleSizeChange: (newSize: Size) => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({
  children,
  product,
}: {
  children: React.ReactNode
  product: Product
}) {
  const { user } = useTokenContext()
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)

  // 1. `view_item` Event: Triggered only when the page is loaded.
  useEffect(() => {
    if (!product.skus || product.skus.length === 0) return

    const skusInStock = product.skus.filter(
      (sku: Sku) => sku.stock_available > 0,
    )

    if (skusInStock.length === 0) return

    const skusEventData: GTMViewItemEvent = {
      event: 'view_item',
      dzns_id: user?.id,
      ecommerce: {
        items: skusInStock.map((sku: Sku) => ({
          item_name: product.title,
          item_id: sku.id,
          price: Number(sku.price_wholesale),
          item_brand: COMPANY_NAME,
          item_category: product.categories?.[0]?.title || 'Unknown',
          item_variant: sku.color.title,
          item_size: sku.size.title,
        })),
      },
    }

    pushToDataLayer(skusEventData)
  }, [product, user?.id])

  // Memoize filtered SKUs to prevent unnecessary recalculations
  const skusWithSelectedColor = useMemo(
    () =>
      product.skus.filter(
        (sku: Sku) => sku.color.title === selectedColor.title,
      ),
    [product.skus, selectedColor.title],
  )

  // Optimize finding SKU with most images using a single pass
  const skuWithMostImages = useMemo(() => {
    if (!skusWithSelectedColor.length) return skusWithSelectedColor[0]

    return skusWithSelectedColor.reduce((max, sku) =>
      (sku?.product_images?.length || 0) > (max?.product_images?.length || 0)
        ? sku
        : max,
    )
  }, [skusWithSelectedColor])

  const selectedSku = useMemo(
    () =>
      skusWithSelectedColor.find(
        (sku: Sku) => sku.size.title === (selectedSize as Size)?.title,
      ) ?? null,
    [skusWithSelectedColor, selectedSize],
  )

  // Preload images for the next color
  useEffect(() => {
    const nextColorIndex =
      (product.colors.findIndex((c) => c.title === selectedColor.title) + 1) %
      product.colors.length
    const nextColor = product.colors[nextColorIndex]

    const nextColorSkus = product.skus.filter(
      (sku) => sku.color.title === nextColor.title,
    )
    if (nextColorSkus.length > 0) {
      const nextSkuWithImages = nextColorSkus.reduce((max, sku) =>
        (sku?.product_images?.length || 0) > (max?.product_images?.length || 0)
          ? sku
          : max,
      )

      if (nextSkuWithImages?.product_images?.[0]) {
        const img = new Image()
        img.src = nextSkuWithImages.product_images[0].file_key
      }
    }
  }, [selectedColor, product.colors, product.skus])

  // Optimize color change handler
  const handleColorChange = useCallback((newColor: Color) => {
    setSelectedColor(newColor)
    setSelectedSize(null)
  }, [])

  // Optimize size change handler
  const handleSizeChange = useCallback(
    (newSize: Size) => {
      setSelectedSize(newSize)

      const selectedSku = product.skus.find(
        (sku: Sku) =>
          sku.color.title === selectedColor?.title &&
          sku.size.title === newSize.title,
      )

      if (selectedSku) {
        const skuSelectEventData: GTMSelectItemEvent = {
          event: 'select_item',
          dzns_id: user?.id,
          ecommerce: {
            items: [
              {
                item_name: product.title,
                item_id: selectedSku.id,
                price: Number(selectedSku.price_wholesale),
                item_brand: COMPANY_NAME,
                item_category: product.categories?.[0]?.title || 'Unknown',
                item_variant: selectedSku.color.title,
                item_size: selectedSku.size.title,
              },
            ],
          },
        }

        pushToDataLayer(skuSelectEventData)
      }
    },
    [product, selectedColor, user?.id],
  )

  const value = {
    selectedColor,
    selectedSize,
    skusWithSelectedColor,
    skuWithMostImages,
    selectedSku,
    handleColorChange,
    handleSizeChange,
  }

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  )
}

export function useProduct() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider')
  }
  return context
}
