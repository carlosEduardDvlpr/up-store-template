import { Product } from "@/data/types/product";
import { http } from "../http";

export async function getProductRecomendations(
  productId: string,
  topK: number,
): Promise<Product[] | null> {
  try {
    const products = await http<Product[]>(`/api/products/recommend/id`, {
      method: "POST",
      body: JSON.stringify({ productId, topK }),
      next: {
        revalidate: 60 * 60 * 8, // 8 hours
      },
    }); 
    return products;
  } catch (error) {
    return null
  }
}
