import { Suspense } from "react";
import AllProductsLoading from "./loading";
import { ProductsCatalog } from "@/components/Catalogs/";

export default async function SearchPage() {
  return (
    <div>
      <Suspense fallback={<AllProductsLoading />}>
        <ProductsCatalog />
      </Suspense>
    </div>
  );
}
