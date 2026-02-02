"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

import { ToastAddToCart } from "@/components/Toaster/toast-add-product-cart";
import { ToastError } from "@/components/Toaster/toast-error";
import { api } from "@/data/api";
import { Sku } from "@/data/types/sku";
import {
  GTMAddToCartEvent,
  GTMRemoveFromCartEvent,
  pushToDataLayer,
} from "@/lib/gtm";
import { useTokenContext } from "./token-context";
import { formatCurrencyToNumber } from "@/lib/utils";
import { ToastDecreaseCartItem } from "@/components/Toaster/toast-decrease-cart-item";
import { addToCart } from "@/clients/database/add-to-cart";
import { decreaseCartItem } from "@/clients/database/decrease-cart-item";
import { getCustomerCart } from "@/clients/database/get-customer-cart";
import { COMPANY_NAME } from "@/data/constants";

/* ---------------------------- Types ---------------------------- */

export interface CartProductProps {
  sku: Sku | null;
}

export interface CartItem {
  product_name: string;
  product_id: number;
  sku_id: number;
  sku_code: string;
  quantity: number;
  price_wholesale: string;
  discount_percentage?: number;
  sku_title: string;
  slug: string;
  stock_available: number;
  product_image_url: string | null;
  background_color?: string | null;
  color_name: string;
  size_name: string;
}

export interface CartData {
  id: string;
  items: CartItem[];
}

interface CartContextType {
  cart: CartData | null;
  addToCartV1: (skuId: number | null) => void;
  decreaseItemQuantity: (skuId: number) => void;
  resetCart: () => Promise<void>;
}

const CART_COOKIE_ENDPOINT = "/cart/cookie";

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useTokenContext();
  const [cart, setCart] = useState<CartData | null>({ id: "", items: [] });
  const hasLoadedCart = useRef(false);
  const hasInitializedId = useRef(false);

  /* -------- First Load: Try DB if logged in, fallback to Cookie -------- */
  useEffect(() => {
    const initializeCart = async () => {
      if (!user) return;
      try {
        const dbCart = await getCustomerCart();
        setCart(dbCart);
      } catch (error) {
        ToastError({
          title: "Carrinho de compras",
          description: "Erro ao buscar o carrinho.",
          jsonError: JSON.stringify(error),
        });
      } finally {
        hasLoadedCart.current = true;
        hasInitializedId.current = true;
      }
    };

    initializeCart();
  }, [user]);

  const addToCartV1 = useCallback(
    async (skuId: number | null) => {
      if (!skuId) {
        console.warn("[Cart] Attempted to add null SKU to cart");
        ToastError({
          title: "Carrinho de compras",
          description: "Selecione a cor e então o tamanho do produto.",
        });
        return;
      }

      try {
        const updatedCart = await addToCart(cart?.id ?? null, skuId);
        if (updatedCart) {
          setCart(updatedCart);
        } else {
          ToastError({
            title: "Carrinho de compras",
            description: "Não foi possível adicionar ao carrinho.",
          });
          return;
        }

        // Find item details for toast notification
        const addedItem =
          updatedCart?.items?.find(
            (item: CartItem) => item?.sku_id === skuId,
          ) || cart?.items?.find((item) => item?.sku_id === skuId);

        // Toast Success
        if (addedItem) {
          ToastAddToCart({
            title: addedItem.product_name,
            color: addedItem.color_name,
            size: addedItem.size_name,
            image: addedItem.product_image_url,
          });

          // GTM Event
          const addToCartEventData: GTMAddToCartEvent = {
            event: "add_to_cart",
            dzns_id: user?.id,
            ecommerce: {
              items: [
                {
                  item_name: addedItem.product_name,
                  item_id: addedItem.sku_id,
                  price: formatCurrencyToNumber(addedItem.price_wholesale),
                  item_brand: COMPANY_NAME,
                  item_variant: addedItem.color_name,
                  item_size: addedItem.size_name,
                },
              ],
            },
          };
          pushToDataLayer(addToCartEventData);
        }
      } catch (error) {
        ToastError({
          title: "Carrinho de compras",
          description: "Erro ao adicionar produto ao carrinho.",
          jsonError: JSON.stringify(error),
        });
      }
    },
    [cart, user],
  );

  const decreaseItemQuantity = useCallback(
    async (skuId: number) => {
      try {
        if (!cart || !cart.items || !skuId || cart.items.length === 0) {
          ToastError({
            title: "Carrinho de compras",
            description: "Produto não encontrado no carrinho.",
          });
          return;
        }
        const cartItem = cart?.items?.find((item) => item.sku_id === skuId);

        const updatedCart = await decreaseCartItem(cart.id, skuId);
        if (updatedCart) {
          if (cartItem) {
            ToastDecreaseCartItem({
              title: cartItem.product_name,
              color: cartItem.color_name,
              size: cartItem.size_name,
              image: cartItem.product_image_url ?? "",
            });

            // GTM Event
            const removeFromCartEventData: GTMRemoveFromCartEvent = {
              event: "remove_from_cart",
              dzns_id: user?.id,
              ecommerce: {
                items: [
                  {
                    item_name: cartItem.product_name,
                    item_id: cartItem.sku_id,
                    price: formatCurrencyToNumber(cartItem.price_wholesale),
                    item_brand: COMPANY_NAME,
                    item_variant: cartItem.color_name,
                    item_size: cartItem.size_name,
                  },
                ],
              },
            };
            pushToDataLayer(removeFromCartEventData);
          }
          setCart(updatedCart);
        } else {
          ToastError({
            title: "Carrinho de compras",
            description: "Não foi possível atualizar o carrinho.",
          });
          return;
        }
      } catch (error) {
        console.error("[Cart] Error decreasing item quantity:", error);
        ToastError({
          title: "Carrinho de compras",
          description: "Erro ao atualizar quantidade do produto.",
          jsonError: JSON.stringify(error),
        });
      }
    },
    [cart, user],
  );

  const resetCart = useCallback(async () => {
    try {
      // Reset cart state to default empty state
      setCart({ id: "", items: [] });

      // Clear the cart cookie
      await api(CART_COOKIE_ENDPOINT, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      ToastError({
        title: "Carrinho de compras",
        description: "Erro ao deletar o carrinho.",
        jsonError: JSON.stringify(error),
      });
    }
  }, []);

  /* ------------------- Return Context ------------------- */
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCartV1,
        decreaseItemQuantity,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* ------------------- Hook to Use Cart ------------------- */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
