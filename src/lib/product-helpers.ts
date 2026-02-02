import { CartItem } from "@/contexts/cart-context";
import { OrderItem } from "@/data/types/order-items";

export function groupProductsByName(items: CartItem[]) {
  const groupedItems: {
    [productName: string]: {
      product_id: number;
      product_name: string;
      price: string;
      slug: string;
      product_image_url?: string | null;
      items: {
        [colorName: string]: CartItem[];
      };
    };
  } = {};

  items?.forEach((item) => {
    const productName = item.product_name || "";
    if (!groupedItems[productName]) {
      groupedItems[productName] = {
        product_id: item.product_id,
        product_name: productName,
        product_image_url: item.product_image_url,
        slug: item.slug,
        price: item.price_wholesale,
        items: {},
      };
    }

    const colorName = item.color_name || "";
    if (!groupedItems[productName].items[colorName]) {
      groupedItems[productName].items[colorName] = [];
    }
    groupedItems[productName].items[colorName].push(item);
  });

  return groupedItems;
}

export function groupOrderItemsByProductName(items: OrderItem[]) {
  const groupedItems: {
    [productName: string]: {
      product_code: string;
      product_name: string;
      price: number;
      product_image_url?: string | null;
      items: {
        [colorName: string]: OrderItem[];
      };
    };
  } = {};

  items?.forEach((item) => {
    const productName = item.product_name || "";
    if (!groupedItems[productName]) {
      groupedItems[productName] = {
        product_code: item.product_code,
        product_name: productName,
        product_image_url: item.product_image_url,
        price: item.price,
        items: {},
      };
    }

    const colorName = item.color_name || "";
    if (!groupedItems[productName].items[colorName]) {
      groupedItems[productName].items[colorName] = [];
    }
    groupedItems[productName].items[colorName].push(item);
  });

  return groupedItems;
}
