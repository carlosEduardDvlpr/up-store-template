'use client'

import { ShoppingBag } from 'lucide-react'

import { useCart } from '@/contexts/cart-context'

export function CartWidget() {
  const { cart } = useCart()
  const itemsCount = cart?.items ? cart.items.length : 0

  return (
    <div className="flex items-center gap-2">
      <ShoppingBag className="h-4 w-4" />
      <span className="text-sm">Cart ({itemsCount})</span>
    </div>
  )
}
