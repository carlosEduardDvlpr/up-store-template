import { Product } from "@/data/types/product";
import { http } from "../http";

interface ProductsGeneralSearchProps {
  q: string;
  page: number;
  perPage: number;
  colorCodes?: string[];
  sizeCodes?: string[];
  classificationCodes?: string[];
}

interface GetFeaturedProductsResponse {
  items: Product[];
  count: number;
}

export async function searchProducts({
  q,
  page,
  perPage,
  colorCodes,
  sizeCodes,
  classificationCodes,
}: ProductsGeneralSearchProps): Promise<GetFeaturedProductsResponse> {
  const body = { q, page, perPage, colorCodes, sizeCodes, classificationCodes, isAvailable: true };
  try {
    const response = await http<GetFeaturedProductsResponse>(`/api/products`, {
      method: "POST",
      body: JSON.stringify(body),
      next: {
        revalidate: 60 * 60, // 1 hour
      },
      credentials: 'omit',
    });
    const { items, count } = response
    return { items, count };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { items: [], count: 0 };
  }
}
