import { Suspense } from "react";
import CatalogPageError from "./error";
import CatalogLoadingComponent from "./loading";
import { ProductsCatalog } from "@/components/Catalogs";

interface ParamProductProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CatalogPage(props: ParamProductProps) {
  const params = await props.params;
  const type = "catalog";
  const slug = params.slug;
  if (!slug) {
    return <CatalogPageError />;
  }
  return (
    <div>
      <div>
        <Suspense fallback={<CatalogLoadingComponent />}>
          <ProductsCatalog type={type} slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}
