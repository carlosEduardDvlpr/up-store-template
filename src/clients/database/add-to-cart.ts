import { http } from "../http";
import { CartData } from "@/contexts/cart-context";

export async function addToCart(
  cartId: string | null,
  skuId: number,
): Promise<CartData | null> {
  try {
    const data = await http<{ cart: CartData }>("/api/carts/add-to-cart", {
      method: "POST",
      body: JSON.stringify({
        cart_id: cartId,
        sku_id: skuId,
      }),
    });
    const cart = data.cart
    return cart;
  } catch (error) {
    return null;
  }
}
