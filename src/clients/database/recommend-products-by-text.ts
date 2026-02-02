import { Product } from "@/data/types/product";
import { http } from "../http";

export async function recommendProductsByText(
  message: string,
  topK: number,
): Promise<Product[] | null> {
  try {
    const products = await http<Product[]>(`/api/products/recommend/text`, {
      method: "POST",
      body: JSON.stringify({ message, topK }),
      next: {
        revalidate: 60 * 60 * 8, // 8 hours
      },
    }); 
    return products;
  } catch (error) {
    return null
  }
}

