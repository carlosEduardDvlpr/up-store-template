"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, FormEvent } from "react";
import { useTokenContext } from "@/contexts/token-context";
import Cart from "../Cart";
import { useRouter, useSearchParams } from "next/navigation";
import { useStoreConfiguration } from "@/contexts/store-context";

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  const { user, signOut } = useTokenContext();
  const { categories } = useStoreConfiguration();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const query = searchParams.get("q");
  const isLoggedIn = !!user;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserClick = () => {
    if (isLoggedIn) {
      setShowAccountMenu(!showAccountMenu);
    } else {
      window.location.href = "/sign-in";
    }
  };

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const query = data.q as string;
    if (!query) return;
    if (formRef.current) formRef.current.reset();
    router.push(`/search?q=${query}`);
  }

  // Monta o menu dinâmico
  const navigationPages =
    categories
      ?.filter((c) => c.show_in_header)
      .sort((a, b) => a.position - b.position)
      .map((c) => ({
        title: c.title ?? "SEM TÍTULO",
        href: `/category/${c.slug}`,
      })) ?? [];

  // Adiciona o link "TODOS" fixo
  navigationPages.unshift({ title: "TODOS", href: "/search" });

  return (
    <header className="border-b border-border sticky top-0 bg-background z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Left - Logo */}
          <Link href="/">
            <h1 className="text-2xl font-light tracking-tight whitespace-nowrap cursor-pointer hover:opacity-70 transition-opacity">
              KALLI
            </h1>
          </Link>

          {/* Center - Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navigationPages.map((page, index) => (
              <Link
                key={index}
                href={page.href}
                className="text-sm font-light tracking-wide uppercase hover:opacity-70 transition-opacity"
              >
                {page.title}
              </Link>
            ))}
          </nav>

          {/* Right - Search, User, Cart */}
          <div className="flex items-center gap-2">
            <form
              id="search-products"
              className="hidden md:flex items-center gap-2 border border-border px-3 py-2 rounded-none"
              onSubmit={handleSearch}
            >
              <Input
                type="search"
                name="q"
                defaultValue={query ?? ""}
                placeholder="O que você está buscando?"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-light w-48 lg:w-64 p-0 h-auto"
              />
              <Search className="h-4 w-4 text-muted-foreground" />
            </form>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none md:hidden"
              form="search-products"
              type="submit"
            >
              <Search className="h-5 w-5" />
            </Button>

            <div className="relative" ref={menuRef}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none"
                onClick={handleUserClick}
              >
                <User className="h-5 w-5" />
              </Button>
              {isLoggedIn && showAccountMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-background border border-border shadow-lg z-50">
                  <div className="p-4 border-b border-border">
                    <p className="text-sm font-medium">Minha Conta</p>
                    <p className="text-xs text-muted-foreground">
                      Kalli Fashion
                    </p>
                  </div>
                  <nav className="py-2">
                    <Link
                      href="/account/orders"
                      className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      Meus Pedidos
                    </Link>
                    <Link
                      href="/account/profile"
                      className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      Meus Dados
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors border-t border-border mt-2 pt-3"
                    >
                      Sair
                    </button>
                  </nav>
                </div>
              )}
            </div>
            <Cart />
          </div>
        </div>
      </div>
    </header>
  );
}
