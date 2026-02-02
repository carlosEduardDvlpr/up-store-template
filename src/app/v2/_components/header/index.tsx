'use client';

import { useState } from 'react';
import { navLinks } from '../../_mocks/nav-links';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  return (
    <header className="font-serif fixed left-0 right-0 z-50 transition-all duration-300 bg-background border-b border-border">
      {/* frete - cupom */}
      <div className="bg-[#7CB89D] text-white text-xs md:text-sm py-3 text-center">
        Frete Gratis para pedidos acima de R$ 999 | Use o cupom: FRETEGRATIS
      </div>

      <div className="mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* NavLinks */}
          <div className="flex items-center gap-6 flex-1">
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.slice(0, 5).map((link) => (
                <div
                  key={link.href}
                  className="relative group"
                  onMouseEnter={() => setActiveSubmenu(link.href)}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <Link
                    href={link.href}
                    className="text-xs font-light tracking-wider uppercase hover:opacity-70 transition-opacity flex items-center gap-1"
                  >
                    {link.label}
                    {link.submenu && <ChevronDown className="h-3 w-3" />}
                  </Link>
                  {link.submenu && activeSubmenu === link.href && (
                    <div className="absolute top-full left-0 pt-2">
                      <div className="bg-background border border-border shadow-lg min-w-[180px]">
                        {link.submenu.map((subLink) => (
                          <Link
                            key={subLink.href}
                            href={subLink.href}
                            className="block px-4 py-2.5 text-xs font-light hover:bg-secondary transition-colors text-foreground"
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Center - Logo */}
          <Link
            href="/"
            className="absolute left-1/2 transform -translate-x-1/2"
          >
            <h1 className="text-2xl lg:text-3xl font-light tracking-[0.2em] whitespace-nowrap cursor-pointer hover:opacity-70 transition-opacity">
              KALLI
            </h1>
          </Link>

          <div className="flex items-center gap-2 lg:gap-3 flex-1 justify-end">
            {/* Search */}
            <div className="hidden lg:flex items-center gap-2 border px-3 py-2 rounded-none bg-transparent">
              <Input
                type="search"
                placeholder="Buscar..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-light w-32 p-0 h-auto bg-transparent"
              />
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Login */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none hidden lg:flex hover:bg-white/10"
              onClick={() => alert('Logou')}
            >
              <User className="h-4 w-4" />
            </Button>

            {/* BagShooping */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none relative hover:bg-white/10"
              onClick={() => alert('Carrinho')}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
