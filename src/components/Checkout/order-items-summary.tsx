import { STANDARD_SIZES, UNIVERSAL_SIZE } from "@/data/constants";
import { OrderItem } from "@/data/types/order-items";
import { formatCurrency } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

interface GroupedProduct {
  product_code: string;
  product_name: string;
  product_image_url?: string | null;
  price: number;
  items: {
    [colorName: string]: OrderItem[];
  };
}

interface OrderItemsSummaryProps {
  groupedItems: {
    [productName: string]: GroupedProduct;
  };
}

const getSizesForProduct = (
  items: OrderItem[],
): { letter: string; number: string }[] => {
  const hasUN = items.some((item) => {
    const sizeName = item.size_name || "";
    return (
      sizeName === UNIVERSAL_SIZE.letter || sizeName === UNIVERSAL_SIZE.number
    );
  });

  return hasUN ? [UNIVERSAL_SIZE] : STANDARD_SIZES;
};

const findMatchingSku = (
  skus: OrderItem[],
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

export function SizeCell({
  matchingSku,
}: {
  matchingSku: OrderItem | undefined;
}) {
  if (!matchingSku) {
    return <span className="text-gray-300">-</span>;
  }

  return (
    <div className="flex flex-col w-full items-center">
      <span className="text-sm font-base py-2">{matchingSku.quantity}</span>
    </div>
  );
}

export function ProductRow({
  colorName,
  skus,
}: {
  colorName: string;
  skus: OrderItem[];
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
}

export function ProductTable({ product }: { product: GroupedProduct }) {
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
}

export function OrderItemsSummary({ groupedItems }: OrderItemsSummaryProps) {
  return (
    <div className="space-y-6 lg:space-y-10">
      {Object.values(groupedItems).map((product) => {
        const price = Number(product.price);

        const totalQuantity = Object.values(product.items).reduce(
          (productTotal, skus) =>
            productTotal + skus.reduce((t, sku) => t + sku.quantity, 0),
          0,
        );

        const groupSubtotal = Number(product.price) * totalQuantity;

        const Totals = (
          <div className="mt-2 pt-1 w-full border border-b-0 pb-1 px-4 uppercase">
            <div className="grid w-full grid-cols-[auto,1fr] gap-x-4 gap-y-1">
              <span className="text-xl md:text-md font-thin text-gray-600">
                Quantidade:
              </span>
              <span className="text-lg font-thin text-gray-900 tabular-nums text-right">
                {totalQuantity}
              </span>

              <span className="text-lg font-thin text-gray-600">
                Subtotal:
              </span>
              <span className="text-lg md:text-md font-thin text-gray-900 tabular-nums text-right">
                {formatCurrency(groupSubtotal)}
              </span>
            </div>
          </div>
        );

        return (
          <div key={product.product_name}>
            <div className="mb-3 flex items-stretch gap-3">
              <div className="w-[min(16vw,120px)] min-w-[120px] shrink-0">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-none bg-gray-100 ring-1 ring-gray-200">
                  {product?.product_image_url ? (
                    <Image
                      src={product.product_image_url}
                      alt={product.product_name}
                      sizes="(max-width:640px) 120px, (max-width:1024px) 140px, 20vw"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-thin leading-tight text-gray-900">
                    {product.product_name}
                  </h3>
                </div>

                <p className="text-xl font-thin leading-none text-gray-900">
                  {formatCurrency(price)}
                </p>
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
}
