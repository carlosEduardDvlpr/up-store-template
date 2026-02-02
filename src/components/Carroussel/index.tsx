"use client";

import * as React from "react";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/data/types/product";
import { CarouselHeader } from "./carousel-header";
import { CarouselSkeleton } from "./carousel-skeleton";
import { ProductCard } from "../ProductCard";

export interface CategoryProps {
  title: string;
  slug?: string;
  url?: string;
}

interface HomeCarouselProps {
  products: Product[] | null;
  category: CategoryProps;
}

export function HomeCarousel({ products, category }: HomeCarouselProps) {
  // Move the conditional check outside the hooks to avoid the conditional hook calls
  const isProductsArray = Array.isArray(products) && products?.length > 0;

  // Always call the hooks, even if the products array is empty
  const container = useRef<HTMLDivElement | null>(null);

  // Render a skeleton when products array is empty, but still call the hooks
  if (!isProductsArray) {
    return <CarouselSkeleton category={category} />;
  }

  return (
    <section
      aria-labelledby={`${category.title}-carousel-heading`}
      className="my-8"
    >
      <div ref={container} className="my-3 md:pl-3">
        <CarouselHeader category={category} />
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="embla"
        >
          <CarouselContent>
            {products.map((product) => {
              return (
                <CarouselItem key={product.id} className="embla__slide">
                  <Card className="overflow-hidden border-0 rounded-none">
                    <CardContent
                      className="p-0"
                      style={{ aspectRatio: "2 / 3" }}
                    >
                      <ProductCard product={product} />
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex sm:flex" />
          <CarouselNext className="hidden md:flex sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
