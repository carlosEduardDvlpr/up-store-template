"use server";

import { http } from "../http";
import { CartItem } from "@/contexts/cart-context";

export interface CartData {
  id: string;
  items: CartItem[];
  cart_items: CartItem[];
}

export async function getCustomerCart(): Promise<CartData | null> {
  try {
    const data = await http<CartData>("/api/carts", {
      method: "GET",
    });
    return {
      ...data,
      items: data.cart_items,
    };
  } catch (error) {
    return null;
  }
}
