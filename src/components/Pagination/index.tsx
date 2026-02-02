"use client";

import { Button } from "@/components/Buttons";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalCount: number;
  path: string;
}

export function Pagination({ totalCount, path }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageIndex = Number(searchParams.get("page") ?? 1);
  const perPage = Number(searchParams.get("perPage") ?? 20);
  const pages = Math.ceil(totalCount / perPage) || 1;
  const hasNextPage = pageIndex < pages;
  const hasPreviousPage = pageIndex > 1;

  const updatePageInUrl = (page: number) => {
    const urlObj = new URL(path, window.location.origin);
    urlObj.searchParams.set("page", page.toString());
    urlObj.searchParams.set("perPage", perPage.toString());
    return urlObj.toString().replace(window.location.origin, "");
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (pageIndex - 1 > 0) pageNumbers.push(pageIndex - 1);
    pageNumbers.push(pageIndex);
    if (pageIndex + 1 <= pages) pageNumbers.push(pageIndex + 1);
    return pageNumbers;
  };

  return (
    <div className="py-2 mt-8">
      <div className="flex items-center justify-between px-4 py-4 uppercase font-base text-base">
        <span className="text-xs md:text-sm text-muted-foreground">
          {totalCount} produto(s)
        </span>

        <div className="flex items-center gap-6 lg:gap-8">
          <div className="hidden sm:block text-xs sm:text-sm font-base">
            Página {pageIndex} de {pages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0 rounded-none"
              onClick={() => router.push(updatePageInUrl(1))}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Primeira página</span>
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 rounded-none"
              disabled={!hasPreviousPage}
              onClick={() => router.push(updatePageInUrl(pageIndex - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
            {getPageNumbers().map((page) => (
              <Button
                key={page}
                variant={page === pageIndex ? "default" : "outline"}
                className="h-8 w-8 p-0 rounded-none"
                onClick={() => router.push(updatePageInUrl(page))}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              className="h-8 w-8 p-0 rounded-none"
              disabled={!hasNextPage}
              onClick={() => router.push(updatePageInUrl(pageIndex + 1))}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próxima página</span>
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 rounded-none"
              onClick={() => router.push(updatePageInUrl(pages))}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Última página</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
