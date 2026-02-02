"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { useProductCard } from "@/contexts/product-card-context";
import { motion, AnimatePresence } from "framer-motion";

export function ProductImage() {
  const { selectedSku, isHovered, handleProductClick, product } =
    useProductCard();

  const images = product.product_images;

  // Animation variants for the image transition
  const imageVariants = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <div className="block pb-[140%] w-full bg-gray-200 cursor-pointer relative overflow-hidden">
      {images?.[0]?.file_key ? (
        <>
          {/* Using AnimatePresence to handle the animation when images change */}
          <AnimatePresence mode="sync" initial={false}>
            {/* First image (shown when not hovered or no second image) */}
            {(!isHovered || !images[1]?.file_key) && (
              <motion.div
                key="image-0"
                className="absolute inset-0"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={imageVariants}
              >
                <Image
                  alt={images[0].file_key}
                  src={images[0].file_key || "/placeholder.svg"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover"
                  priority
                />
              </motion.div>
            )}

            {/* Second image (shown when hovered and exists) */}
            {isHovered && images[1]?.file_key && (
              <motion.div
                key="image-1"
                className="absolute inset-0"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={imageVariants}
              >
                <Image
                  alt={images[1].file_key}
                  src={images[1].file_key || "/placeholder.svg"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="w-1/3 h-1/3 text-gray-400" strokeWidth={1} />
        </div>
      )}
    </div>
  );
}
