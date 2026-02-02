import { Product } from "@/data/types/product";
import { http } from "../http";

interface GetProductBySlugHttpResponse {
  product: Product | null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const data = await http<GetProductBySlugHttpResponse>(
      `/api/products/${slug}`,
      {
        next: {
          revalidate: 60 * 60, // 1 hour
        },
      },
    );
    const product = data.product
    return product;
  } catch (err) {
    return null;
  }
}
