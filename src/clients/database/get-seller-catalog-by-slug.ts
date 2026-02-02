import { http } from "@/clients/http";
import { Product } from "@/data/types/product";

export type SellerCatalog = {
  id: string;
  type: string | null;
  created_at: Date;
  updated_at: Date | null;
  seller_id: string;
  products: Product[] | [];
};

export interface RequestResponse {
  catalog: SellerCatalog;
  count: number;
  perPage: number;
  totalPages: number;
}

export interface GetSellerCatalogBySlugResponse {
  items: Product[];
  count: number;
  perPage?: number;
  totalPages?: number;
}

export async function getSellerCatalogBySlug(
  slug: string,
): Promise<GetSellerCatalogBySlugResponse | null> {
  try {
    const data = await http<RequestResponse>(`/api/sellers/catalogs/${slug}`, {
      method: "GET",
      next: {
        tags: ["sellers"],
      },
    });
    const products = data.catalog.products;
    return {
      items: products,
      count: data.count,
      perPage: data.perPage,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return null; // or you can throw the error depending on your needs
  }
}
