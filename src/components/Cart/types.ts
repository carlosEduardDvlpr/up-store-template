import { CartItem } from '@/contexts/cart-context'
import { Color } from '@/data/types/colors'
import { Size } from '@/data/types/sizes'

export interface CartButtonProps {
  sku: CartItem | null
  onColorSelect?: (color: Color) => void
  onSizeSelect?: (size: Size) => void
  className?: string
}
