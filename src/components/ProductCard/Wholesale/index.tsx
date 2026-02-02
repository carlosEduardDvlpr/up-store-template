"use client";

import { Product } from "@/data/types/product";
import CalculateShippingForm from "@/components/Forms/CalculateShipping";
import { ProductPrice } from "../product-price";
import { ColorSizeGrid } from "./color-size-grid";
import { ProductProvider } from "@/contexts/product-context";
import { ImageCarousel } from "./product-card-images";
import { CreditCard, HistoryIcon, Package, Truck } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SignUpForm } from "@/components/Forms/SignUp";
import { Button } from "@/components/Buttons";
import {
  INSTALLMENTS,
  MINIMUM_PURCHASE_ITEM_QUANTITY,
  PIX_DISCOUNT_PERCENTAGE,
} from "@/data/constants";
import { useTokenContext } from "@/contexts/token-context";

interface ProductCardProps {
  product: Product;
}

function ProductCardContent({ product }: ProductCardProps) {
  const { user, isLoading } = useTokenContext();
  const [showSignupModal, setShowSignupModal] = useState(false);
  return (
    <div className="bg-white md:max-w-[76vw] mx-auto mx-18 px-3 md:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ImageCarousel product={product} />

        <div className="border-0 ring-0 shadow-none">
          <h1 className="pt-4 text-center md:text-start text-2xl tracking-tight text-[#121212] md:pt-0 font-light">
            {product.title}
          </h1>
          <div className="space-y-6 py-3">
            {!user && !isLoading ? (
              <div className="text-center space-y-4 py-12 border border-border bg-secondary/30">
                <p className="text-lg font-light text-muted-foreground">
                  Faça login para visualizar preços e adicionar produtos ao
                  carrinho
                </p>
                <Dialog
                  open={showSignupModal}
                  onOpenChange={setShowSignupModal}
                >
                  <DialogContent className="sm:max-w-2xl  md:max-w-[80vw] max-h-[90vh] overflow-y-auto">
                    <SignUpForm />
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => setShowSignupModal(true)}
                  className="bg-foreground text-background hover:bg-foreground/90 h-12 px-8 text-sm font-medium tracking-wide uppercase rounded-none"
                >
                  Cadastre-se para ver o preço
                </Button>
              </div>
            ) : (
              <>
                <form className="space-y-4 mt-4">
                  <div>
                    <ProductPrice price={product.price_wholesale} />
                  </div>

                  <ColorSizeGrid product={product} />
                  <div className="mt-3">
                    <p className="text-xs font-medium mb-2">Legenda:</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-border bg-background" />
                        <span>Disponível</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-border bg-secondary">
                          <HistoryIcon className="w-4 h-4" />
                        </div>
                        <span>Esgotado</span>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="space-y-2 md:space-y-7 pt-2 lg:pt-0">
                  <CalculateShippingForm />
                </div>
              </>
            )}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <Package className="h-5 w-5 text-muted-foreground" />
                <span className="font-light">
                  Pedido mínimo: {MINIMUM_PURCHASE_ITEM_QUANTITY} peças
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="font-light">
                  {PIX_DISCOUNT_PERCENTAGE * 100}% de desconto no PIX
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="font-light">
                  Parcelamento em até {INSTALLMENTS}x sem juros
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="font-light">Entrega para todo o Brasil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <ProductProvider product={product}>
      <ProductCardContent product={product} />
    </ProductProvider>
  );
}
