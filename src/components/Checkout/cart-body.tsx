"use client";

import { CartItem } from "@/contexts/cart-context";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { DecreaseQuantityButton } from "../Cart/decrease-quantity-button";
import { memo } from "react";
import { AddToCartButton } from "../Cart/add-to-cart-button";
import {
  INSTALLMENTS,
  PIX_DISCOUNT_PERCENTAGE,
  STORE_URL,
} from "@/data/constants";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

const STANDARD_SIZES = [
  { letter: "P", number: "38" },
  { letter: "M", number: "40" },
  { letter: "G", number: "42" },
  { letter: "GG", number: "44" },
];

const UN_SIZE = { letter: "UN", number: "0" };

interface GroupedProduct {
  product_id: number;
  product_name: string;
  slug?: string | null;
  product_image_url?: string | null;
  price: string;
  items: {
    [colorName: string]: CartItem[];
  };
}

interface CartBodyProps {
  groupedItems: {
    [productName: string]: GroupedProduct;
  };
}

const hasUniversalSize = (items: CartItem[]): boolean => {
  return items.some((item) => {
    const sizeName = item.size_name || "";
    return sizeName === UN_SIZE.letter || sizeName === UN_SIZE.number;
  });
};

const getSizesForProduct = (
  items: CartItem[],
): { letter: string; number: string }[] => {
  const hasUN = hasUniversalSize(items);
  return hasUN ? [UN_SIZE] : STANDARD_SIZES;
};

const findMatchingSku = (
  skus: CartItem[],
  standardSize: { letter: string; number: string },
) => {
  return skus.find((sku) => {
    const sizeName = sku.size_name || "";
    return (
      sizeName === standardSize.letter ||
      sizeName === standardSize.number ||
      sizeName === `${standardSize.letter} ${standardSize.number}` ||
      sizeName === standardSize.number
    );
  });
};

const SizeCell = memo(function SizeCell({
  matchingSku,
}: {
  matchingSku: CartItem | undefined;
}) {
  if (!matchingSku) {
    return <span className="text-gray-300">-</span>;
  }

  return (
    <div className="flex flex-col w-full items-center">
      <AddToCartButton sku={matchingSku} className="min-w-full" />
      <span className="text-sm font-base py-2">{matchingSku.quantity}</span>
      <DecreaseQuantityButton sku={matchingSku} className="min-w-full" />
    </div>
  );
});

const ProductRow = memo(function ProductRow({
  colorName,
  skus,
}: {
  colorName: string;
  skus: CartItem[];
}) {
  const sizes = getSizesForProduct(skus);

  return (
    <tr className="border-y border-gray-200">
      <td className="w-[200px]">
        <div className="flex flex-col items-center">
          {skus[0].background_color && (
            <div
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-gray-200 mb-1"
              style={{ backgroundColor: skus[0].background_color }}
            />
          )}

          <span className="block text-[0.625rem] sm:text-sm font-medium text-gray-900 max-w-[4rem] lg:max-w-[5rem] truncate text-center">
            {colorName}
          </span>
        </div>
      </td>
      {sizes.map((size) => {
        const matchingSku = findMatchingSku(skus, size);
        return (
          <td
            key={size.letter}
            className="text-center w-[80px] min-w-[60px] border-l border-r border-gray-200"
          >
            <SizeCell matchingSku={matchingSku} />
          </td>
        );
      })}
    </tr>
  );
});

const ProductTable = memo(function ProductTable({
  product,
}: {
  product: GroupedProduct;
}) {
  const sizes = getSizesForProduct(Object.values(product.items).flat());

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-t border-x">
        <thead>
          <tr className="divide-x divide-gray-200">
            <th className="text-center text-sm font-base text-gray-500 py-2 w-[200px] uppercase">
              Cores
            </th>
            {sizes.map((size) => (
              <th
                key={size.letter}
                className="text-center text-sm font-base text-gray-500 py-2 w-[80px]"
              >
                {size.letter}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(product.items).map(([colorName, skus]) => (
            <ProductRow key={colorName} colorName={colorName} skus={skus} />
          ))}
        </tbody>
      </table>
    </div>
  );
});

export const CartBody = memo(function CartBody({
  groupedItems,
}: CartBodyProps) {
  return (
    <div className="divide-gray-200">
      {Object.values(groupedItems).map((product) => {
        const price = Number(product.price);
        const pixPrice = price * (1 - PIX_DISCOUNT_PERCENTAGE);
        const installmentValue = price / INSTALLMENTS;
        const productUrl = `${STORE_URL}/product/${product.slug}`;

        const totalQuantity = Object.values(product.items).reduce(
          (productTotal, skus) =>
            productTotal + skus.reduce((t, sku) => t + sku.quantity, 0),
          0,
        );

        const groupSubtotal = Number(product.price) * totalQuantity;

        const Totals = (
          <div className="mt-2 pt-1 w-full border border-b-0 pb-1 px-4 uppercase">
            <div className="grid w-full grid-cols-[auto,1fr] gap-x-4 gap-y-1">
              <span className="text-sm md:text-md font-thin text-gray-600">
                Quantidade:
              </span>
              <span className="text-sm md:text-md font-thin text-gray-900 tabular-nums text-right">
                {totalQuantity}
              </span>

              <span className="text-sm md:text-md font-thin text-gray-600">
                Subtotal:
              </span>
              <span className="text-sm md:text-md font-thin text-gray-900 tabular-nums text-right">
                {formatCurrency(groupSubtotal)}
              </span>
            </div>
          </div>
        );

        return (
          <div key={product.product_name} className="py-6">
            <div className="mb-3 flex items-stretch gap-3">
              <div className="w-[min(16vw,120px)] min-w-[120px] shrink-0">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-none bg-gray-100 ring-1 ring-gray-200">
                  {product?.product_image_url ? (
                    <Link href={productUrl}>
                      <Image
                        src={product.product_image_url}
                        alt={product.product_name}
                        sizes="(max-width:640px) 120px, (max-width:1024px) 140px, 20vw"
                        fill
                        className="object-cover"
                      />
                    </Link>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <Link href={productUrl}>
                        <ImageIcon className="h-8 w-8" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-base leading-tight text-gray-900">
                    {product.product_name}
                  </h3>
                </div>

                <div className="space-y-1">
                  <p className="text-2xl font-base leading-none text-gray-900">
                    {formatCurrency(pixPrice)}
                    <span className="ml-2 align-middle text-xs font-base text-gray-700">
                      no PIX ({PIX_DISCOUNT_PERCENTAGE * 100}%)
                    </span>
                  </p>

                  <div className="flex flex-col lg:flex-row lg:space-x-2 text-gray-600">
                    <p className="text-md ">{formatCurrency(price)}</p>
                    <p className="pt-1 text-xs text-green-800">
                      ou {INSTALLMENTS}x de {formatCurrency(installmentValue)}{" "}
                      sem juros
                    </p>
                  </div>
                </div>
                {/* md+: Totals stay here (current layout) */}
                <div className="hidden md:block border-b">{Totals}</div>
              </div>
            </div>
            {/* sm: Totals go below wrapper */}
            <div className="mt-4 block md:hidden">{Totals}</div>

            <ProductTable product={product} />
          </div>
        );
      })}
    </div>
  );
});
