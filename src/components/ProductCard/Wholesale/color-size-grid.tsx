"use client";

import { memo, useCallback } from "react";
import { Product } from "@/data/types/product";
import { Sku } from "@/data/types/sku";
import { Color } from "@/data/types/colors";
import { CartItem, useCart } from "@/contexts/cart-context";
// import { Divider } from "@/components/Divider";

import { AddToCartButton } from "@/components/Cart/add-to-cart-button";
import { DecreaseQuantityButton } from "@/components/Cart/decrease-quantity-button";
import { useProduct } from "@/contexts/product-context";
import { HistoryIcon, X } from "lucide-react";
import { Button } from "@/components/Buttons";

// Types
interface ColorSizeGridProps {
  product: Product;
}

interface TableHeaderProps {
  sizes: string[];
}

interface TableRowProps {
  color: Color;
  sizes: string[];
  isSelected: boolean;
  product: Product;
}

// Memoized components for better performance
const TableHeader = memo(({ sizes }: TableHeaderProps) => (
  <thead className="border-b border-gray-200">
    <tr>
      <th className="px-3 py-2 text-center text-xs md:text-sm font-medium text-gray-500 border-r border-gray-200 uppercase">
        Cor
      </th>
      {sizes.map((sizeLabel) => (
        <th
          key={sizeLabel}
          className="px-2 py-2 text-center text-xs md:text-sm font-medium text-gray-500 border-r border-gray-200 last:border-r-0"
        >
          {sizeLabel}
        </th>
      ))}
    </tr>
  </thead>
));

TableHeader.displayName = "TableHeader";

const TableRow = memo(
  ({ color, sizes, isSelected, product }: TableRowProps) => {
    const { cart } = useCart();
    const { handleColorChange, handleSizeChange, selectedSize } = useProduct();

    const getSkuForColorAndSize = useCallback(
      (colorCode: string, sizeCode: string) => {
        return (
          product.skus.find(
            (sku) => sku.color_code === colorCode && sku.size_code === sizeCode,
          ) || null
        );
      },
      [product.skus],
    );

    const convertSkuToCartItem = useCallback(
      (sku: Sku): CartItem => {
        const cartItem = cart?.items.find((item) => item.sku_id === sku.id);
        return {
          product_id: sku.product_id,
          sku_id: sku.id,
          sku_code: sku.code,
          quantity: cartItem?.quantity || 0,
          sku_title: sku.title || product.title,
          slug: product.slug || "",
          stock_available: sku.stock_available,
          price_wholesale: sku.price_wholesale?.toString(),
          product_image_url: sku.product_images?.[0]?.file_key || null,
          background_color: sku.color.background_color ?? null,
          color_name: sku.color.title,
          size_name: sku.size.title,
          product_name: product.title,
        };
      },
      [cart?.items, product],
    );

    return (
      <tr>
        <td className="whitespace-nowrap md:px-3 md:py-3 sm:py-4 text-sm border-r border-gray-200 w-[20%] lg:h-[140px]">
          <div className="flex flex-col items-center justify-center">
            <div
              className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 rounded-full overflow-hidden border border-gray-200 mb-1"
              style={{ backgroundColor: color.background_color }}
            />
            <div className="text-center">
              <div className="text-[0.625rem] sm:text-sm font-medium text-gray-900 max-w-[4rem] lg:max-w-[5rem] truncate">
                {color.title}
              </div>
            </div>
          </div>
        </td>

        {sizes.map((sizeLabel) => {
          const sizeObj = product.sizes.find((s) => s.title === sizeLabel);
          const sku = sizeObj
            ? getSkuForColorAndSize(color.code, sizeObj.code)
            : null;
          const inStock = sku ? sku.stock_available > 0 : false;
          const isSelected = selectedSize?.title === sizeLabel;
          const cartItem = sku ? convertSkuToCartItem(sku) : null;

          return (
            <td
              key={`${color.code}-${sizeLabel}`}
              className="whitespace-nowrap text-sm md:text-base text-center border-r border-gray-200 last:border-r-0 lg:w-40 min-w-[80px] h-[105px]"
            >
              {sizeObj && inStock && cartItem ? (
                <div
                  className="flex flex-row justify-between p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSizeChange(sizeObj);
                  }}
                >
                  <DecreaseQuantityButton
                    sku={cartItem}
                    onColorSelect={handleColorChange}
                    onSizeSelect={handleSizeChange}
                  />

                  <Button
                    variant="outline"
                    className="flex min-h-full w-full justify-center items-center min-w-11"
                  >
                    <span
                      className={
                        "text-sm md:text-lg lg:text-xl font-base text-gray-800"
                      }
                      title={`${cartItem.color_name} - ${cartItem.size_name}`}
                    >
                      {cartItem.quantity}
                    </span>
                  </Button>
                  <AddToCartButton
                    sku={cartItem}
                    onColorSelect={handleColorChange}
                    onSizeSelect={handleSizeChange}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-secondary border border-border">
                  <HistoryIcon className="w-8 h-8" />
                </div>
              )}
            </td>
          );
        })}
      </tr>
    );
  },
);

TableRow.displayName = "TableRow";

export const ColorSizeGrid = memo(({ product }: ColorSizeGridProps) => {
  const hasUniversalSize = product.sizes.some(
    (size) => size.code === "UN" || size.title === "UN",
  );

  const { selectedColor } = useProduct();

  const allSizes = hasUniversalSize
    ? ["UN"]
    : ["P 38", "M 40", "G 42", "GG 44"];

  return (
    <div>
      {!hasUniversalSize && (
        <div className="xl:hidden flex justify-center text-[0.625rem] tracking-widest font-base uppercase text-gray-500 mb-2 px-2 py-1 bg-gray-50 rounded">
          Deslize para ver todos os tamanhos →
        </div>
      )}

      <div
        className={`overflow-x-auto max-w-full border border-border ${!hasUniversalSize ? "md:mx-0" : ""
          } pb-2`}
      >
        <div
          className={`${!hasUniversalSize ? "min-w-[520px] md:min-w-full md:px-0" : ""
            }`}
        >
          <table className="min-w-full">
            <TableHeader sizes={allSizes} />
            <tbody>
              {product.colors.map((color) => (
                <TableRow
                  key={color.code}
                  color={color}
                  sizes={allSizes}
                  isSelected={selectedColor.code === color.code}
                  product={product}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

ColorSizeGrid.displayName = "ColorSizeGrid";
