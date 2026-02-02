"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/data/types/product";
import { ProductGrid } from "@/components/ProductGrid";
import { Pagination } from "@/components/Pagination";
import { ProductCatalogFilters } from "./product-catalog-filters";
import { useSearchParams } from "next/navigation";
import { getCategoryProducts } from "@/clients/database/get-category-products";
import { productsGeneralSearch } from "@/lib/database";
import { getSellerCatalogBySlug } from "@/clients/database/get-seller-catalog-by-slug";
import { createQueryString } from "@/lib/query-helpers";

interface SearchProductsResponse {
  items: Product[] | null;
  count: number;
}

export function ProductsCatalog({
  type = "search",
  slug,
}: {
  type?: string;
  slug?: string;
}) {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<SearchProductsResponse | null>(null);

  // Use useMemo to memoize the filters object
  const filters = useMemo(
    () => ({
      q: searchParams.get("q") ?? "",
      colorCodes: searchParams.get("colorCodes")?.split(",") ?? [],
      sizeCodes: searchParams.get("sizeCodes")?.split(",") ?? [],
    }),
    [searchParams],
  );

  const page = Number(searchParams.get("page") ?? 1);
  const perPage = Number(searchParams.get("perPage") ?? 20);

  const path =
    type === "catalog"
      ? `/catalog/${slug}`
      : type === "category"
        ? `/category/${slug}`
        : `/search`;

  const fullPath =
    type === "catalog"
      ? `/catalog/${slug}${createQueryString(filters, {
          page,
          perPage,
        })}`
      : type === "category"
        ? `/category/${slug}${createQueryString(filters, {
            page,
            perPage,
          })}`
        : `/search${createQueryString(filters, { page, perPage })}`;

  useEffect(() => {
    if (slug) {
      if (type === "category") {
        getCategoryProducts({
          slug,
          page,
          perPage,
          ...filters,
        }).then((data) => setResult(data));
      } else if (type === "catalog") {
        getSellerCatalogBySlug(slug).then((data) => setResult(data));
      }
    } else {
      productsGeneralSearch({ page, perPage, ...filters }).then((data) =>
        setResult(data),
      );
    }
  }, [filters, page, perPage, path, slug, type]);

  return (
    <main className="flex flex-col">
      <ProductCatalogFilters count={result?.count ?? 0} path={path} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:max-w-full">
        <ProductGrid products={result?.items ?? []} />
      </div>

      <Pagination totalCount={result?.count ?? 0} path={fullPath} />
    </main>
  );
}
