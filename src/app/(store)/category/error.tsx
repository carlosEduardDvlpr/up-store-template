'use client'

import Image from "next/image";
import Link from "next/link";

export default function CategoryPageError() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 text-center">
      <Image
        src="/images/category-not-found.svg" // Use a minimal illustration here
        alt="Categoria não encontrada"
        width={180}
        height={180}
        className="mb-6 opacity-60"
      />

      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
        Categoria não encontrada
      </h1>
      <p className="text-gray-600 text-sm md:text-base mb-6">
        A categoria que você está tentando acessar não existe ou foi removida.
      </p>

      <Link
        href="/"
        className="inline-block border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 px-6 py-2 rounded-full text-sm font-medium"
      >
        Voltar à página inicial
      </Link>
    </div>
  );
}
