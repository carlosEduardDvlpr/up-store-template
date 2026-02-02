"use client";

import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { CartItem, useCart } from "@/contexts/cart-context";
import { GTMViewCartEvent, pushToDataLayer } from "@/lib/gtm";
import { useTokenContext } from "@/contexts/token-context";
import { DecreaseQuantityButton } from "./decrease-quantity-button";
import { backgroundVariant } from "./animations/variants";
import { AddToCartButton } from "./add-to-cart-button";
import { ToastError } from "../Toaster/toast-error";
import { formatCurrency } from "@/lib/utils";
import {
  INSTALLMENTS,
  MINIMUM_PURCHASE_ITEM_QUANTITY,
  PIX_DISCOUNT_PERCENTAGE,
  STANDARD_SIZES,
  STORE_URL,
} from "@/data/constants";
import Link from "next/link";

interface GroupedProduct {
  product_id: number;
  product_name: string;
  product_image_url: string | null;
  slug: string | null;
  color_name: string;
  skus: CartItem[];
}

interface GroupedItems {
  [key: string]: GroupedProduct;
}

interface ProductGroup {
  product_id: number;
  product_name: string;
  product_image_url?: string | null;
  slug: string | null;
  price: number;
  colorVariants: {
    [colorName: string]: CartItem[];
  };
}

const groupProductsByNameAndColor = (
  items: GroupedProduct[],
): ProductGroup[] => {
  const productGroups: { [key: string]: ProductGroup } = {};

  items.forEach((item) => {
    const productKey = item.product_name;

    if (!productGroups[productKey]) {
      productGroups[productKey] = {
        product_id: item.product_id,
        product_name: item.product_name,
        product_image_url: item.product_image_url ?? undefined,
        slug: item.slug,
        price: Number(item.skus[0]?.price_wholesale || 0),
        colorVariants: {},
      };
    }

    productGroups[productKey].colorVariants[item.color_name] = item.skus;
  });

  return Object.values(productGroups);
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

// Component for displaying product sizes
function SizeSelector({
  colorVariants,
  productName,
}: {
  colorVariants: { [colorName: string]: CartItem[] };
  productName: string;
  productSlug?: string | null;
}) {
  const [selectedColor, setSelectedColor] = useState<string>(
    Object.keys(colorVariants)[0],
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check if any SKU has UN size
  const hasUniversalSize = Object.values(colorVariants).some((skus) =>
    skus.some((sku) => sku.size_name === "UN" || sku.size_name === "0"),
  );

  // Filter out UN if not available, but keep the order of other sizes
  const sizeColumns = STANDARD_SIZES.filter(
    (size) =>
      size.letter !== "UN" || (size.letter === "UN" && hasUniversalSize),
  );
  const columnWidth = `${100 / (sizeColumns.length + 1)}%`; // +1 for the color column

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="w-full min-w-[500px]">
        <table className="w-full divide-y divide-gray-200 table-fixed border-t border-x">
          <thead>
            <tr>
              <th
                className="md:px-3 py-1 md:py-2 text-center text-xs md:text-sm font-base text-gray-500 border-r border-gray-200"
                style={{ width: isMobile ? columnWidth : "200px" }}
              >
                <span className="uppercase">Cores</span>
              </th>
              {sizeColumns.map((standardSize) => (
                <th
                  key={standardSize.letter}
                  className="px-1 md:px-2 text-center text-xs md:text-sm font-base text-gray-500 border-r border-gray-200 last:border-r-0"
                  style={{ width: columnWidth }}
                >
                  {standardSize.letter}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {Object.entries(colorVariants).map(([colorName, skus]) => (
              <tr
                key={colorName}
                className={`hover:bg-gray-50 ${selectedColor === colorName ? "bg-gray-50" : ""
                  }`}
                onClick={() => setSelectedColor(colorName)}
              >
                <td className="whitespace-nowrap align-middle text-center p-0 m-0 text-sm border-r border-b border-gray-200">
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

                {sizeColumns.map((standardSize) => {
                  const matchingSku = findMatchingSku(skus, standardSize);
                  const displaySku = matchingSku || {
                    sku_id: `${skus[0]?.product_id}-${colorName}-${standardSize.letter}`,
                    product_id: skus[0]?.product_id,
                    product_name: productName,
                    product_image_url: skus[0]?.product_image_url,
                    slug: skus[0]?.slug,
                    color_name: colorName,
                    size_name: `${standardSize.letter} (${standardSize.number})`,
                    quantity: 0,
                    price_wholesale: "0",
                  };

                  const showAddButton = !!matchingSku;

                  return (
                    <td
                      key={`${colorName}-${standardSize.letter}`}
                      className="whitespace-nowrap text-center border-r border-b border-gray-200 last:border-r-0 p-0"
                    >
                      {showAddButton ? (
                        <div className="flex flex-col">
                          <AddToCartButton
                            sku={matchingSku as CartItem}
                            className="min-w-full"
                          />
                          <div className="border-x border-gray-200">
                            <span className="text-base font-medium text-gray-700 block py-3 md:py-5">
                              {displaySku.quantity}
                            </span>
                          </div>
                          <DecreaseQuantityButton
                            sku={matchingSku as CartItem}
                            className="min-w-full"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Component for displaying price
function PriceDisplay({
  price,
  isLoggedIn,
}: {
  price: number;
  isLoggedIn: boolean;
}) {
  if (!isLoggedIn)
    return (
      <div className="text-sm md:text-base font-base text-gray-900">R$ -</div>
    );

  const pixPrice = price * (1 - PIX_DISCOUNT_PERCENTAGE);
  const installmentValue = price / INSTALLMENTS;

  return (
    <div className="space-y-1">
      {/* PIX (destaque) */}
      <p className="text-2xl font-base leading-none text-gray-900">
        {formatCurrency(pixPrice)}
        <span className="ml-2 align-middle text-xs font-base text-gray-700">
          no PIX ({PIX_DISCOUNT_PERCENTAGE * 100}%)
        </span>
      </p>

      {/* Original + parcelas */}
      <div className="flex flex-col lg:flex-row lg:space-x-2 text-gray-600">
        <p className="text-md line-through">{formatCurrency(price)}</p>
        <p className="pt-1 text-xs text-green-800">
          ou {INSTALLMENTS}x de {formatCurrency(installmentValue)} sem juros
        </p>
      </div>
    </div>
  );
}

function CartProductItem({ group }: { group: ProductGroup }) {
  const { user } = useTokenContext();
  const isLoggedIn = Boolean(user?.id);
  const productUrl = `${STORE_URL}/product/${group.slug}`;

  const totalQuantity = Object.values(group.colorVariants).reduce(
    (productTotal, skus) =>
      productTotal + skus.reduce((t, sku) => t + sku.quantity, 0),
    0,
  );

  const groupSubtotal = Number(group.price) * totalQuantity;

  const Totals = (
    <div className="w-full border pb-2 px-4 uppercase">
      <div className="mt-2 grid w-full grid-cols-[auto,1fr] gap-x-4 gap-y-1">
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
    <li className="py-6">
      {/* Wrapper: image + infos */}
      <div className="grid grid-cols-[auto,1fr] gap-4">
        {/* Image */}
        <div className="w-[min(20vw,140px)] shrink-0">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-none bg-gray-100 ring-1 ring-gray-200">
            {group?.product_image_url ? (
              <Link href={productUrl}>
                <Image
                  src={group.product_image_url}
                  alt={group.product_name}
                  fill
                  sizes="(max-width:640px) 120px, (max-width:1024px) 140px, 20vw"
                  className="object-cover"
                />
              </Link>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}
          </div>
        </div>

        {/* Infos */}
        <div className="min-w-0 h-full">
          <div className="flex flex-col justify-between h-full">
            <h3 className="text-base md:text-lg font-base text-gray-900 line-clamp-2">
              {group.product_name}
            </h3>

            <div className="mt-2">
              <PriceDisplay price={group.price} isLoggedIn={isLoggedIn} />
            </div>

            {/* md+: Totals stay here (current layout) */}
            <div className="hidden md:block">{Totals}</div>
          </div>
        </div>
      </div>

      {/* sm: Totals go below wrapper */}
      <div className="mt-4 md:hidden">{Totals}</div>

      <div className="mt-4">
        <SizeSelector
          colorVariants={group.colorVariants}
          productName={group.product_name}
        />
      </div>
    </li>
  );
}

// Cart header component
function CartHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-2 md:px-4 py-3 md:py-6 bg-white z-10 border-b border-gray-200 flex-shrink-0">
      <h2 className="text-sm md:text-lg font-base uppercase text-gray-900">
        Carrinho de Compras
      </h2>
      <button className="text-gray-400 hover:text-gray-500" onClick={onClose}>
        <X className="h-6 w-6" />
      </button>
    </div>
  );
}

// Component for cart footer
function CartFooter({
  subtotal,
  totalQuantity,
  onCheckout,
  isLoggedIn,
}: {
  subtotal: number;
  totalQuantity: number;
  onCheckout: () => void;
  isLoggedIn: boolean;
}) {
  return (
    <div className="px-4 py-6 border-t border-gray-200 bg-white z-10 flex-shrink-0 mt-auto space-y-1">
      <div className="flex justify-between text-sm md:text-base font-base text-gray-900">
        <p>Quantidade</p>
        {isLoggedIn ? <p>{`${totalQuantity} itens`}</p> : <p>0</p>}
      </div>
      <div className="flex justify-between text-sm md:text-base font-base text-gray-900">
        <p>Subtotal</p>
        {isLoggedIn ? <p>{formatCurrency(subtotal)}</p> : <p>R$ -</p>}
      </div>

      <div className="flex justify-between text-sm md:text-base font-base text-gray-900">
        <p />
        {isLoggedIn ? (
          <p className="mt-0.5 text-xs md:text-sm font-base text-gray-500">
            {`em até ${INSTALLMENTS}x de ${formatCurrency(subtotal / INSTALLMENTS)}`}
          </p>
        ) : (
          <p></p>
        )}
      </div>
      <motion.button
        onClick={onCheckout}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        animate="animate"
        variants={backgroundVariant}
        className="mt-2 md:mt-6 w-full rounded-none px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium uppercase border border-gray-200"
      >
        <div className="overflow-hidden relative h-6 w-full">
          <motion.p
            variants={firstTextVariant}
            className="relative text-center text-sm md:text-base whitespace-nowrap tracking-wide"
          >
            FINALIZAR COMPRA
          </motion.p>
          <motion.p
            variants={secondTextVariant}
            aria-hidden
            className="absolute top-0 left-0 w-full text-center text-sm md:text-base whitespace-nowrap tracking-wide"
          >
            FINALIZAR COMPRA
          </motion.p>
        </div>
      </motion.button>
    </div>
  );
}

// Main Cart component
export default function Cart() {
  const { cart } = useCart();
  const { user } = useTokenContext();
  const [open, setOpen] = useState(false);
  const isLoggedIn = Boolean(user?.id);

  const { itemsCount, subtotal, groupedProducts } = useMemo(() => {
    const itemsCount = cart?.items
      ? cart.items.reduce((total, sku) => total + sku.quantity, 0)
      : 0;
    const subtotal = cart?.items
      ? cart.items.reduce(
        (total, sku) => total + Number(sku.price_wholesale) * sku.quantity,
        0,
      )
      : 0;

    // First group by product and color
    const groupedItems: GroupedItems = cart?.items
      ? cart.items.reduce((acc: GroupedItems, item) => {
        const colorName = item.color_name || "Unknown";
        const groupKey = `${item.product_id}-${colorName}`;

        if (!acc[groupKey]) {
          acc[groupKey] = {
            product_id: item.product_id,
            product_name: item.product_name || "",
            product_image_url: item.product_image_url,
            slug: item.slug || null,
            color_name: colorName,
            skus: [],
          };
        }
        acc[groupKey].skus.push(item);
        return acc;
      }, {})
      : {};

    // Then group by product name
    const groupedProducts = groupProductsByNameAndColor(
      Object.values(groupedItems),
    );

    return { itemsCount, subtotal, groupedProducts };
  }, [cart]);

  const isValidQuantity =
    itemsCount >= MINIMUM_PURCHASE_ITEM_QUANTITY ? true : false;

  const handleCheckout = () => {
    if (!cart || cart.items.length < 1) {
      ToastError({
        title: "Carrinho de compras",
        description: "Carrinho está vazio",
      });
    } else if (!isValidQuantity) {
      ToastError({
        title: "Carrinho de compras",
        description: `Quantidade mínima de 12 itens, carrinho contém apenas ${itemsCount}.`,
      });
    } else {
      window.location.href = "/checkout";
    }
  };

  // Trigger `view_cart` event when the cart is opened
  useEffect(() => {
    if (open) {
      const viewCartEventData: GTMViewCartEvent = {
        event: "view_cart",
        dzns_id: user?.id,
        ecommerce: {
          items: cart?.items
            ? cart.items.map((sku) => ({
              item_name: sku.product_name ?? sku.sku_title,
              item_id: sku.sku_id,
              price: Number(sku.price_wholesale),
              item_variant: sku.color_name || "Unknown",
              item_size: sku.size_name || "Unknown",
              quantity: sku.quantity,
            }))
            : [],
        },
      };
      pushToDataLayer(viewCartEventData);
    }
  }, [open, user, cart?.items]);

  return (
    <>
      <button
        className="group flex items-center p-2 text-zinc-500 hover:text-zinc-800"
        onClick={() => setOpen((prev) => !prev)}
      >
        <ShoppingBag
          size={28}
          strokeWidth={1}
          className="h-4 w-4 md:h-6 md:w-6 flex-shrink-0"
          aria-hidden="true"
        />
        <span className="lg:flex ml-2 text-sm font-base">({itemsCount})</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-10 flex justify-center items-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="relative tracking-tight w-[90vw] max-h-[80vh] bg-white shadow-xl flex flex-col mb-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full max-h-[80vh]">
                <CartHeader onClose={() => setOpen(false)} />

                <div className="px-2 md:px-4 py-3 md:py-6 overflow-y-auto max-h-[calc(80vh-260px)]">
                  <ul className="divide-y divide-gray-200">
                    {groupedProducts.map((group) => (
                      <CartProductItem
                        key={`${group.product_id}-${group.product_name}`}
                        group={group}
                      />
                    ))}
                  </ul>
                </div>

                <CartFooter
                  subtotal={subtotal}
                  totalQuantity={itemsCount}
                  onCheckout={handleCheckout}
                  isLoggedIn={isLoggedIn}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
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
};

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
};
