import { Product } from './product'
import { Sku } from './sku'

export interface Classification {
  id: number
  code: string
  type_code: string
  type_name: string
  status: number
  title: string
  slug: string
  created_at: Date
  updated_at?: Date
  products: Product[]
  skus: Sku[]
  // Optional filter proprieties
  product_count?: number
}
