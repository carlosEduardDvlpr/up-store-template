"use client";

import { useStoreConfiguration } from "@/contexts/store-context";
import Image from "next/image";

export function HomeCategories() {
  const { categories } = useStoreConfiguration();
  if (!categories) return;
  const activeCategories = categories.filter(
    (category) => category.show_in_home === true && category.cover_image_url,
  );
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <h2 className="text-2xl md:text-3xl font-light tracking-tight uppercase mb-12 text-center">
        Compre por Categoria
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {activeCategories.map((category) => (
          <div key={category.id} className="group cursor-pointer">
            <div className="relative aspect-[3/4] mb-3 overflow-hidden bg-secondary">
              <Image
                src={category.cover_image_url ?? ""}
                alt={category.title ?? ""}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="text-sm font-light tracking-wide uppercase text-center">
              {category.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
