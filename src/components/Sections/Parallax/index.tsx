"use client"

import { Button } from "@/components/Buttons";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function ParallaxImage({
  src,
  alt,
  speed = 0.5,
}: {
  src: string;
  alt: string;
  speed?: number;
}) {
  const [offsetY, setOffsetY] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;

      const rect = imageRef.current.getBoundingClientRect();
      const scrollPercent =
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const offset = scrollPercent * 100 * speed;

      setOffsetY(offset);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={imageRef} className="relative w-full h-full overflow-hidden">
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${offsetY}px) scale(1.2)`,
        }}
      />
    </div>
  );
}

export function ParallaxSection() {
  return (
    <div className="mt-24 space-y-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        <div className="relative overflow-hidden bg-secondary">
          <ParallaxImage
            src="/minimalist-fashion-hero-pastel-tones.jpg"
            alt="Coleção Verão 2025"
            speed={0.5}
          />
        </div>
        <div className="flex items-center justify-center p-8 lg:p-16 bg-[#f5f1ed]">
          <div className="max-w-md space-y-6">
            <h2 className="text-3xl lg:text-4xl font-light tracking-wide">
              Coleção Verão 2025
            </h2>
            <p className="text-base font-light text-muted-foreground leading-relaxed">
              Descubra nossa nova coleção inspirada nas cores e texturas do
              verão. Peças leves, confortáveis e elegantes que combinam
              perfeitamente com o seu estilo de vida moderno e sofisticado.
            </p>
            <Button className="bg-foreground text-background hover:bg-foreground/90 h-12 px-8 text-sm font-medium tracking-wide uppercase rounded-none">
              Ver Coleção
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        <div className="flex items-center justify-center p-8 lg:p-16 bg-[#e8e4df] order-2 lg:order-1">
          <div className="max-w-md space-y-6">
            <h2 className="text-3xl lg:text-4xl font-light tracking-wide">
              Moda Sustentável
            </h2>
            <p className="text-base font-light text-muted-foreground leading-relaxed">
              Comprometidos com o futuro do planeta, utilizamos materiais
              sustentáveis e processos de produção conscientes. Cada peça é
              criada pensando no impacto ambiental e na durabilidade.
            </p>
            <Button className="bg-foreground text-background hover:bg-foreground/90 h-12 px-8 text-sm font-medium tracking-wide uppercase rounded-none">
              Saiba Mais
            </Button>
          </div>
        </div>
        <div className="relative overflow-hidden bg-secondary order-1 lg:order-2">
          <ParallaxImage
            src="/pink-blouse-beige-pants-outfit.webp"
            alt="Sustentabilidade"
            speed={0.3}
          />
        </div>
      </div>
    </div>
  );
}
