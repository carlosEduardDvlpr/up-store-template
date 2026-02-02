"use client";

import { memo, useCallback, useRef } from "react";
import { useCart } from "@/contexts/cart-context";
import { CartButtonProps } from "./types";
import { Button } from "../Buttons";

export const DecreaseQuantityButton = memo(
  ({ sku, className }: CartButtonProps) => {
    const { decreaseItemQuantity } = useCart();
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleDecreaseQuantity = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!sku?.sku_id) return;
        decreaseItemQuantity(sku.sku_id);
      },
      [sku, decreaseItemQuantity],
    );

    return (
      <Button
        ref={buttonRef}
        type="button"
        onClick={handleDecreaseQuantity}
        variant="outline"
        className={className}
        aria-label="Diminuir quantidade"
      >
        <p className="relative text-center font-base text-base md:text-lg min-w-8">
          -
        </p>
      </Button>
    );
  },
);

DecreaseQuantityButton.displayName = "DecreaseQuantityButton";
