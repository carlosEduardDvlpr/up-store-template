"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Color } from "@/data/types/colors";
import { Size } from "@/data/types/sizes";
import { Product } from "@/data/types/product";
import { Sku } from "@/data/types/sku";
import { GTMSelectItemEvent, pushToDataLayer } from "@/lib/gtm";
import { useTokenContext } from "@/contexts/token-context";
import { COMPANY_NAME } from "@/data/constants";

interface ProductCardContextType {
  selectedColor: Color | null;
  selectedSize: Size | null;
  isHovered: boolean;
  setSelectedColor: (color: Color) => void;
  setSelectedSize: (size: Size) => void;
  setIsHovered: (isHovered: boolean) => void;
  handleColorChange: (newColor: Color) => void;
  handleSizeChange: (newSize: Size) => void;
  handleProductClick: () => void;
  product: Product;
  selectedSku: Sku | null;
}

const ProductCardContext = createContext<ProductCardContextType | undefined>(
  undefined,
);

interface ProductCardProviderProps {
  children: ReactNode;
  product: Product;
  initialColor?: Color | null;
}

export function ProductCardProvider({
  children,
  product,
  initialColor,
}: ProductCardProviderProps) {
  const { user } = useTokenContext();
  const [selectedColor, setSelectedColor] = useState<Color | null>(
    initialColor || null,
  );
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleColorChange = (newColor: Color) => {
    setSelectedColor(newColor);
    setSelectedSize(product.sizes[0] ?? null);
    setIsHovered(false);
  };

  const handleSizeChange = (newSize: Size) => {
    setSelectedSize(newSize);

    const selectedSku = product.skus.find(
      (sku: Sku) =>
        sku.color.title === selectedColor?.title &&
        sku.size.title === newSize.title,
    );

    if (selectedSku) {
      const skuSelectEventData: GTMSelectItemEvent = {
        event: "select_item",
        dzns_id: user?.id,
        ecommerce: {
          items: [
            {
              item_name: product.title,
              item_id: selectedSku.id,
              price: Number(selectedSku.price_wholesale),
              item_brand: COMPANY_NAME,
              item_category: product.categories?.[0]?.title || "Unknown",
              item_variant: selectedSku.color.title,
              item_size: selectedSku.size.title,
            },
          ],
        },
      };

      pushToDataLayer(skuSelectEventData);
    }
  };

  const handleProductClick = () => {
    window?.dataLayer?.push({
      event: "select_item",
      ecommerce: {
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            price: product.price_wholesale,
            currency: "BRL",
          },
        ],
      },
    });
  };

  const skusWithSelectedColor = product?.skus?.filter(
    (sku: Sku) => sku.color_code === selectedColor?.code,
  );

  const selectedSku =
    skusWithSelectedColor?.find(
      (sku: Sku) => sku.size_code === (selectedSize as Size)?.code,
    ) ?? null;

  return (
    <ProductCardContext.Provider
      value={{
        selectedColor,
        selectedSize,
        isHovered,
        setSelectedColor,
        setSelectedSize,
        setIsHovered,
        handleColorChange,
        handleSizeChange,
        handleProductClick,
        product,
        selectedSku,
      }}
    >
      {children}
    </ProductCardContext.Provider>
  );
}

export function useProductCard() {
  const context = useContext(ProductCardContext);
  if (context === undefined) {
    throw new Error("useProductCard must be used within a ProductCardProvider");
  }
  return context;
}
