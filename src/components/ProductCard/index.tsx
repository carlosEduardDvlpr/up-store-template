"use client";

import { useSearchParams } from "next/navigation";
import { ProductInfo } from "./product-info";
import { ColorPicker } from "./color-picker";
import { SizePicker } from "./size-picker";

import { Product } from "@/data/types/product";
import {
  ProductCardProvider,
  useProductCard,
} from "@/contexts/product-card-context";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

function ProductCardContent() {
  const { product, setIsHovered, handleProductClick } = useProductCard();
  const images = product.product_images;

  return (
    <div
      key={product.id}
      className="group relative flex flex-col overflow-hidden border-0 rounded-none bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative aspect-[3/4] overflow-hidden bg-secondary"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${product.slug}`} onClick={handleProductClick}>
          {images?.[0]?.file_key ? (
            <Image
              alt={images[0].file_key}
              src={images[0].file_key || "/placeholder.svg"}
              fill
              className="object-cover transition-opacity duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon
                className="w-1/3 h-1/3 text-gray-400"
                strokeWidth={1}
              />
            </div>
          )}
        </Link>
      </div>

      <ProductInfo />

      <div className="flex flex-col space-y-2 p-2">
        <ColorPicker />
        <SizePicker />
      </div>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  if (!product) {
    return <div>Erro ao carregar os dados do produto</div>;
  }
  const initialColor = null;
  return (
    <ProductCardProvider product={product} initialColor={initialColor}>
      <ProductCardContent />
    </ProductCardProvider>
  );
}
