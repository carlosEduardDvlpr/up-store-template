import { Classification } from "@/data/types/classifications";
import { http } from "../http";

type ServerResponse = {
  items: Classification[] 
}

interface ListClassificationsByTypeCodeResponse {
  classifications: {
    pages: {
      title: string;
      href: string;
    }[] | [];
  };
}

export async function listClassificationsByTypeCode(
  classificationTypeCode: string,
): Promise<ListClassificationsByTypeCodeResponse> {
  try {
    const { items } =
      await http<ServerResponse>(
        "/api/classifications/type-code",
        {
          method: "POST",
          body: JSON.stringify({ classificationTypeCode }),
          next: {
            revalidate: 60 * 60 * 8, // 8 hours
          },
        },
      );

    const formatedClassifications = {
      pages: items 
        .slice(0, 10)
        .map((classification: Classification) => ({
          title: classification.title,
          href: `/api/classifications/${classification.slug}`,
        })),
    };

    return { classifications: formatedClassifications }; // Limit to first 10 classifications
  } catch (error) {
    return {
      classifications: {
        pages: [],
      },
    };
  }
}
