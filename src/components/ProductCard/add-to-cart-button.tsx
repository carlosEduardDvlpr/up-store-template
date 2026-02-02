'use client'

import { useCart } from '@/contexts/cart-context'
import { useProductCard } from '@/contexts/product-card-context'
import { Sku } from '@/data/types/sku'
import { motion } from 'framer-motion'

export interface AddToCartButtonProps {
  sku: Sku | null
  productTitle?: string
}

const firstTextVariant = {
  initial: {
    y: 0,
    opacity: 1,
  },
  hover: {
    y: -20,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1],
    },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1],
    },
  },
}

const secondTextVariant = {
  initial: {
    y: 20,
    opacity: 0,
  },
  hover: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1],
    },
  },
  animate: {
    y: 20,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1],
    },
  },
}

export function AddToCartButton({ productTitle }: AddToCartButtonProps) {
  const { addToCartV1 } = useCart()
  const { selectedSku } = useProductCard()

  function handleAddProductToCart(e: React.MouseEvent) {
    e.stopPropagation()
    if (!selectedSku) return
    addToCartV1(selectedSku.id)
  }

  return (
    <motion.button
      type="button"
      onClick={handleAddProductToCart}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      animate="animate"
      className="flex w-full pt-2 md:pt-1 px-2 h-8 lg:h-12 items-center justify-center backdrop-blur-[2px] text-white  text-base font-normal bg-black bg-opacity-60 hover:bg-opacity-70 hover:bg-green-700 focus:outline-none focus:bg-green-700 focus:opacity-70 lg:text-lg overflow-hidden relative transition-all duration-300"
    >
      <div className="overflow-hidden relative h-6 w-full">
        <motion.p
          variants={firstTextVariant}
          className="relative text-xs md:text-base font-base text-center whitespace-nowrap tracking-wide"
        >
          ADICIONAR AO CARRINHO
        </motion.p>
        <motion.p
          variants={secondTextVariant}
          aria-hidden
          className="absolute top-0 left-0 w-full text-xs md:text-base text-center whitespace-nowrap tracking-wide hidden sm:block"
        >
          {productTitle ?? 'ADICIONAR AO CARRINHO'}
        </motion.p>
      </div>
    </motion.button>
  )
}
