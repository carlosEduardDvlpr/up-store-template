import { Product } from "@/data/types/product";
import { http } from "../http";

type GetClassificationProductsProps = {
  classificationSlug: string;
  q?: string;
  page?: number;
  perPage?: number;
  colorCodes?: string[];
  sizeCodes?: string[];
  classificationCodes?: string[];
};

interface GetFeaturedProductsResponse {
  items: Product[];
  count: number;
}

export async function getClassificationProducts({
  classificationSlug,
  q,
  page,
  perPage,
  colorCodes,
  sizeCodes,
  classificationCodes,
}: GetClassificationProductsProps): Promise<GetFeaturedProductsResponse> {
  const body = {
    q,
    page: page ?? 1,
    perPage: perPage ?? 20,
    colorCodes,
    sizeCodes,
    classificationCodes,
  };
  try {
    const response = await http<GetFeaturedProductsResponse>(
      `/api/products/classifications/${classificationSlug}`,
      {
        method: "POST",
        body: JSON.stringify(body),
        next: {
          revalidate: 60 * 60, // 1 hour
        },
      },
    );
    const { items, count } = response;
    return { items, count };
  } catch (error) {
    return { items: [], count: 0 };
  }
}
