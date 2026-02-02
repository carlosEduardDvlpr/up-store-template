"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductImage {
  file_key: string;
}

interface Product {
  product_images?: ProductImage[];
}

interface ProductImageGalleryProps {
  product: Product;
}

export function ImageCarousel({ product }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const images = product.product_images || [];
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  /** Smooth scroll helper to keep selected thumbnail visible */
  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const child = container.children[index] as HTMLElement | undefined;
    if (!child) return;

    const isVertical = window.innerWidth >= 768;
    if (isVertical) {
      container.scrollTo({
        top:
          child.offsetTop - container.clientHeight / 2 + child.clientHeight / 2,
        behavior: "smooth",
      });
    } else {
      container.scrollTo({
        left:
          child.offsetLeft - container.clientWidth / 2 + child.clientWidth / 2,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToIndex(selectedIndex);
  }, [selectedIndex]);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[600px] bg-muted rounded-none">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const handlePrevious = () => setSelectedIndex((p) => (p > 0 ? p - 1 : p));
  const handleNext = () =>
    setSelectedIndex((p) => (p < images.length - 1 ? p + 1 : p));

  return (
    <div className="flex flex-col md:flex-row gap-4 px-2 items-stretch">
      {/* --- Thumbnail Column (desktop) --- */}
      <div
        className={cn("hidden md:flex shrink-0 flex-col items-center gap-2")}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          disabled={selectedIndex === 0}
          className="h-8 w-8"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>

        <div
          ref={scrollContainerRef}
          className="flex flex-col gap-2 overflow-y-auto max-h-[calc(8*6rem)] scrollbar-none"
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative w-20 h-24 overflow-hidden border-2 rounded-none flex-shrink-0 transition-colors",
                selectedIndex === index
                  ? "border-foreground"
                  : "border-border hover:border-muted-foreground",
              )}
            >
              <Image
                src={image.file_key || "/placeholder.svg"}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          disabled={selectedIndex === images.length - 1}
          className="h-8 w-8"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* --- Main Image --- */}
      <div className="relative flex-1 bg-muted rounded-none overflow-hidden aspect-[3/4] w-full max-h-[100vh]">
        <Image
          src={images[selectedIndex].file_key || "/placeholder.svg"}
          alt={`Product image ${selectedIndex + 1}`}
          fill
          className="object-contain md:object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      {/* --- Thumbnails Beneath Main Image (mobile) --- */}
      <div className="flex md:hidden items-center justify-center gap-2 mt-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          disabled={selectedIndex === 0}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div
          ref={scrollContainerRef}
          className={cn(
            "flex gap-2 overflow-x-auto scrollbar-none px-1",
            "w-full justify-start",
          )}
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative w-20 h-24 overflow-hidden border-2 rounded-none flex-shrink-0 transition-colors",
                selectedIndex === index
                  ? "border-foreground"
                  : "border-border hover:border-muted-foreground",
              )}
            >
              <Image
                src={image.file_key || "/placeholder.svg"}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          disabled={selectedIndex === images.length - 1}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
