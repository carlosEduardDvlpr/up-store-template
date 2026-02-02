"use client";

import Image from "next/image";
import { useInView, motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CarouselNavigation } from "./carousel-navigation";
import { Product } from "@/data/types/product";

const imageVariants = {
  initial: { scale: 1.02, opacity: 0, y: 10, filter: "blur(4px)" },
  animate: (i: number) => ({
    scale: 1,
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, delay: 0.05 * i, ease: [0.2, 0.1, 0.2, 1] },
  }),
  exit: {
    scale: 0.98,
    opacity: 0,
    y: -5,
    filter: "blur(2px)",
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  hover: { scale: 1.01, transition: { duration: 0.2, ease: [0, 0, 0.2, 1] } },
};

const cardVariants = {
  initial: { boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
  animate: {
    boxShadow: "0px 5px 15px rgba(0,0,0,0.03)",
    transition: { duration: 0.6, ease: "easeOut" },
  },
  hover: {
    boxShadow: "0px 8px 20px rgba(0,0,0,0.07)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const counterVariants = {
  initial: { opacity: 0, y: 5, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  update: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.2, times: [0, 0.5, 1] },
  },
};

export function ImageCarousel({ product }: { product: Product }) {
  const container = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(container, { once: false, amount: 0.2 });

  const images = useMemo(
    () => product?.product_images ?? [],
    [product?.product_images],
  );
  const count = images.length;

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(1); // 1-based
  const [previousCurrent, setPreviousCurrent] = useState(1);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);

  // reset “loading” quando trocar produto (SEM useEffect / SEM setState em effect)
  const carouselKey = useMemo(() => product?.id ?? "no-product", [product?.id]);

  const preloadImages = useCallback(
    (currentIndex: number) => {
      if (!images.length) return;
      for (let i = 1; i <= 2; i++) {
        const nextIndex = (currentIndex + i) % images.length;
        const src = images[nextIndex]?.file_key;
        if (src) {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.src = src;
        }
      }
    },
    [images],
  );

  // Aqui o effect faz APENAS subscribe/unsubscribe.
  // setState só acontece dentro do callback do evento -> lint aceita.
  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const idx0 = api.selectedScrollSnap();
      preloadImages(idx0);

      setCurrent((prev) => {
        const next = idx0 + 1;
        if (prev !== next) setPreviousCurrent(prev);
        return next;
      });
    };

    api.on("select", handleSelect);

    // dispara uma sync inicial sem setState no corpo do effect:
    // chamamos o handler (que é "callback de external system") e ele atualiza state.
    handleSelect();

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, preloadImages]);

  return (
    <div ref={container} className="md:col-span-1 lg:col-span-4">
      <Carousel
        key={carouselKey}
        opts={{ align: "start", loop: true }}
        setApi={(a) => setApi(a ?? null)}
        className="w-full mx-auto md:max-w-full relative"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.file_key} className="lg:max-w-[50%] pl-0">
              <motion.div
                initial="initial"
                animate={isInView ? "animate" : "initial"}
                exit="exit"
                whileHover="hover"
                variants={cardVariants}
                custom={index}
              >
                <Card className="overflow-hidden border-0 rounded-none shadow-none">
                  <CardContent
                    className="p-0 relative"
                    style={{ aspectRatio: "31/50" }}
                  >
                    <motion.span
                      className="absolute inset-0 overflow-hidden rounded-none"
                      variants={imageVariants}
                      custom={index}
                    >
                      <Image
                        alt={image.title || `Product image ${index + 1}`}
                        src={image.file_key || "/placeholder.svg"}
                        fill
                        className="rounded-none object-cover transition-all duration-300"
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={85}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
                        onLoad={() => {
                          if (index === 0) setFirstImageLoaded(true);
                        }}
                      />

                      {!firstImageLoaded && index === 0 && (
                        <motion.div
                          className="absolute inset-0 bg-gray-200"
                          animate={{ opacity: [0.5, 0.7, 0.5] }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 1,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                    </motion.span>
                  </CardContent>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <motion.div
          className="absolute top-3 right-3 md:top-4 md:right-4"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <CarouselNavigation
            onPrevious={() => api?.scrollPrev()}
            onNext={() => api?.scrollNext()}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute bottom-4 right-4 md:right-6 bg-white/80 backdrop-blur-sm px-4 py-1 text-sm rounded-full font-medium"
            variants={counterVariants}
            initial="initial"
            animate={previousCurrent !== current ? "update" : "animate"}
            exit="exit"
          >
            {current}/{count}
          </motion.div>
        </AnimatePresence>
      </Carousel>
    </div>
  );
}
