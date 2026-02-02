import { Suspense } from "react";
import AllProductsLoading from "../loading";
import CategoryPageError from "../error";
import { ProductsCatalog } from "@/components/Catalogs";

interface ParamProductProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage(props: ParamProductProps) {
  const params = await props.params;
  const type = "category";
  const slug = params.slug;

  if (!slug) {
    return <CategoryPageError />;
  }

  return (
    <div>
      <Suspense fallback={<AllProductsLoading />}>
        <ProductsCatalog type={type} slug={slug} />
      </Suspense>
    </div>
  );
}
