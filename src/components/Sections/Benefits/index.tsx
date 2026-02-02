import {
  INSTALLMENTS,
  MINIMUM_INSTALLMENT_VALUE,
  MINIMUM_PURCHASE_ITEM_QUANTITY,
} from "@/data/constants";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Tag, Gift } from "lucide-react";

export function BenefitsSection() {
  return (
    <section className="border-y border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-6 md:gap-8">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium tracking-wide uppercase mb-1">
                Parcelamento
              </h3>
              <p className="text-xs text-muted-foreground font-light">
                Em até {INSTALLMENTS}x sem juros, com parcela mínima de{" "}
                {formatCurrency(MINIMUM_INSTALLMENT_VALUE)}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary">
              <Tag className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium tracking-wide uppercase mb-1">
                PIX
              </h3>
              <p className="text-xs text-muted-foreground font-light">
                10% de desconto em pagamentos PIX
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium tracking-wide uppercase mb-1">
                Pedido Mínimo{" "}
              </h3>
              <p className="text-xs text-muted-foreground font-light">
                {`${MINIMUM_PURCHASE_ITEM_QUANTITY} peças`}{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
