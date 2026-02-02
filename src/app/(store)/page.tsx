import { Suspense } from "react";
import { getActiveSlider } from "@/clients/database/get-active-slider";
import { BannerCarousel } from "@/components/Sections/Banner";
import { BannerSkeleton } from "@/components/Skeletons/BannerSkeleton";
import { BenefitsSection } from "@/components/Sections/Benefits";
import { searchProducts } from "@/clients/database/search-products";
import { HomeCarousel } from "@/components/Carroussel";
import { HomeCategories } from "@/components/Sections/Categories";
import { WHATSAPP_URL } from "@/data/constants";
import { WhatsAppIcon } from "@/components/Icons/whatsapp-icon";
import Link from "next/link";

async function NewArrivalsCarousel() {
  const category = {
    title: "novidades",
    slug: "/category",
  };
  const { items } = await searchProducts({ q: " ", page: 1, perPage: 20 });
  return <HomeCarousel products={items} category={category} />;
}

// Separate data fetching components for each section
async function BannerSection() {
  const data = await getActiveSlider();
  if (!data) return;
  return <BannerCarousel slider={data.slider} />;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Suspense fallback={<BannerSkeleton />}>
        <BannerSection />
      </Suspense>

      <BenefitsSection />

      {/* Product Carousel Section */}
      <NewArrivalsCarousel />

      {/* Category Grid */}
      <HomeCategories />

      {/* Need Help Section */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight uppercase mb-4">
            Precisa de ajuda?
          </h2>
          <p className="text-sm font-light mb-8 text-muted-foreground">
            Fale pelo Whatsapp com alguma de nossas atendentes para te auxiliar!
          </p>
          <div className="flex justify-center max-w-md mx-auto">
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 rounded-none px-6 text-sm font-light tracking-wide uppercase h-10"
            >
              <WhatsAppIcon className="w-4 h-4 text-background" />
              Chamar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
