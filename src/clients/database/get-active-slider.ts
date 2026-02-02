import { http } from "../http";

export type SliderImage = {
  file_key: string;
  position: number;
};

export type Slider = {
  images: {
    file_key: string;
    position: number;
  }[];
};

interface GetActiveSliderResponse {
  slider: Slider;
}

export async function getActiveSlider(): Promise<GetActiveSliderResponse | null> {
  try {
    const response = await http<GetActiveSliderResponse>(
      `/api/sliders/active`,
      {
        method: "GET",
        next: {
          revalidate: 60 * 60 * 4, // 4 hour
        },
        credentials: "omit",
      },
    );
    const { slider } = response;
    return { slider };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return null;
  }
}
