import { Metadata } from "next";

import ProductCard from "@/components/ProductCard/Wholesale";
import { getProductBySlug } from "@/clients/database/get-product-by-slug";
import Image from "next/image";
import { ParallaxSection } from "@/components/Sections/Parallax";
import { ProductDetails } from "@/components/ProductCard/product-details";
import Link from "next/link";

interface ParamProductProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export async function generateMetadata(props: ParamProductProps): Promise<Metadata> {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Produto não encontrado",
    };
  }

  return {
    title: product.title,
  };
}

export default async function ProductPage(props: ParamProductProps) {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl text-center">
          {/* Minimalist illustration */}
          <Image
            width={650}
            height={650}
            src="/images/not-found-illustration.svg"
            alt="Produto não encontrado"
            className="mx-auto mb-6 w-80 h-80 object-contain opacity-70"
          />

          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
            Produto não encontrado
          </h1>
          <p className="text-gray-500 mb-6 text-sm md:text-base">
            O produto que você está procurando pode não estar mais disponível ou
            foi removido.
          </p>

          <Link
            href="/"
            className="inline-block border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-300 px-6 py-2 rounded-full text-sm font-medium"
          >
            Voltar à página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white pt-8">
      <ProductCard product={product} />
      {/* Product details */}
      <ProductDetails />
      <ParallaxSection />
    </div>
  );
}
