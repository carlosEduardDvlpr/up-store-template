import { Product } from "@/data/types/product";
import { http } from "../http";

type GetCategoryProductsRequest = {
  slug: string
  q?: string
  page?: number
  perPage?: number
  colorCodes?: string[]
  sizeCodes?: string[]
  classificationCodes?: string[]
  categoryCodes?: string[]
}

type GetCategoryProductsResponse = {
  items: Product[];
  count: number;
  totalPages: number;
}

export async function getCategoryProducts({
  slug,
  q,
  page,
  perPage,
  colorCodes,
  sizeCodes,
  classificationCodes,
}: GetCategoryProductsRequest): Promise<GetCategoryProductsResponse> {
  try {
    const body = {
      q,
      page: page ?? 1,
      perPage: perPage ?? 20,
      colorCodes,
      sizeCodes,
      classificationCodes,
    };
    // const { products, count, totalPages } 
    const response = await http<GetCategoryProductsResponse>(
      `/api/products/categories/${slug}`,
      {
        method: "POST",
        body: JSON.stringify(body),
        next: {
          revalidate: 60 * 60, // 1 hour
        },
      },
    )

    console.log(response)
    const { items, count, totalPages } = response
    return { items, count, totalPages };
  } catch (error) {
    console.error(error);
    return { items: [], count: 0, totalPages: 0 };
  }
}


