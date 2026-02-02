import { http } from "@/clients/http";

export type CategoryStoreConfig = {
  id: number;
  code?: string | null;
  title: string | null;
  slug: string;
  position: number;
  show_in_header: boolean;
  show_in_home: boolean;
  header_image_url?: string | null;
  cover_image_url?: string | null;
};

interface ListSlidersResponse {
  items: CategoryStoreConfig[];
}

export async function getCategoryStoreConfigurations(): Promise<
  CategoryStoreConfig[] | null
> {
  try {
    const response = await http<ListSlidersResponse>(
      `/api/categories/configurations`,
      {
        method: "GET",
        next: {
          tags: ["store"],
        },
      },
    );
    const { items } = response;
    return items;
  } catch (error) {
    console.error("Failed to fetch category store configurations:", error);
    return null;
  }
}
