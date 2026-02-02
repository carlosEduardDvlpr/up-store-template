import { MINIMUM_PURCHASE_ITEM_QUANTITY } from "@/data/constants";
import {
  Store,
  Package,
  CreditCard,
  Truck,
  Shield,
  TrendingUp,
} from "lucide-react";

export function SignUpFormHeader() {
  return (
    <>
      <div className="flex justify-center py-6">
        <div className="text-3xl font-light tracking-[0.2em]">KALLI</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6 border-y border-border">
        <div className="flex flex-col items-center text-center gap-2">
          <Store className="w-8 h-8" />
          <p className="text-xs font-light">Preços Exclusivos</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <Package className="w-8 h-8" />
          <p className="text-xs font-light">
            Pedido Mínimo {MINIMUM_PURCHASE_ITEM_QUANTITY} peças
          </p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <CreditCard className="w-8 h-8" />
          <p className="text-xs font-light">Parcelamento Facilitado</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <Truck className="w-8 h-8" />
          <p className="text-xs font-light">Entrega Rápida</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <Shield className="w-8 h-8" />
          <p className="text-xs font-light">Qualidade Garantida</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <TrendingUp className="w-8 h-8" />
          <p className="text-xs font-light">Suporte Comercial</p>
        </div>
      </div>

      <div className="bg-muted p-4 space-y-2">
        <h3 className="font-medium text-sm">
          Para ser um revendedor Kalli é necessário:
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>CNPJ no Ramo de Vestuário</li>
          <li>Pedido mínimo de {MINIMUM_PURCHASE_ITEM_QUANTITY} peças</li>
        </ol>
      </div>
    </>
  );
}
