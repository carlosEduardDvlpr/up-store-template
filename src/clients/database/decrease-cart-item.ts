import { CartData } from "@/contexts/cart-context";
import { http } from "../http";

export async function decreaseCartItem(cartId: string, skuId: number) {
  try {
    const data = await http<{ cart: CartData }>(
      "/api/carts/decrease-cart-item",
      {
        method: "POST",
        body: JSON.stringify({
          cart_id: cartId,
          sku_id: skuId,
        }),
      },
    );

    const cart = data.cart;
    return cart;
  } catch (error) {
    return null;
  }
}
