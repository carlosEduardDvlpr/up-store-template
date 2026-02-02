"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi, // Import the CarouselApi type
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { BannerImage } from "./banner-image";
import { BannerPagination } from "./banner-pagination";
import { Slider } from "@/clients/database/get-active-slider";

export function BannerCarousel({ slider }: { slider: Slider | null }) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    setSelectedIndex(api.selectedScrollSnap());

    // Listen for "select" event and update the selected index
    api.on("select", () => {
      setSelectedIndex(api.selectedScrollSnap());
    });
  }, [api]);

  // Handle selecting a specific slide
  const scrollTo = (index: number) => {
    if (api) api.scrollTo(index);
  };

  return (
    <div className="relative">
      {/* Carousel */}
      <Carousel
        setApi={setApi} // Set the API when the carousel initializes
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[Autoplay({ delay: 6000, stopOnInteraction: false })]}
      >
        <CarouselContent>
          {slider?.images?.map((image, index) => (
            <CarouselItem key={index} className="pl-0">
              <Card>
                <CardContent className="relative w-full bg-gray-800 min-h-[calc(100vh-64px)]">
                  <BannerImage image={image} />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Pagination Lines */}
      <BannerPagination
        images={slider?.images ?? []}
        selectedIndex={selectedIndex}
        scrollTo={scrollTo}
      />
    </div>
  );
}
