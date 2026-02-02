"use client";

import { memo, useCallback, useRef } from "react";
import { useCart } from "@/contexts/cart-context";
import { CartButtonProps } from "./types";
import { Button } from "../Buttons";

export const AddToCartButton = memo(({ sku, className }: CartButtonProps) => {
  const { addToCartV1 } = useCart();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!sku?.sku_id) return;

      addToCartV1(sku.sku_id);
    },
    [sku, addToCartV1],
  );

  return (
    <Button
      ref={buttonRef}
      type="button"
      onClick={handleAddToCart}
      variant="outline"
      aria-label="Adicionar ao carrinho"
      className={className}
    >
      <p className="relative text-center text-base md:text-lg min-w-8">+</p>
    </Button>
  );
});

AddToCartButton.displayName = "AddToCartButton";
