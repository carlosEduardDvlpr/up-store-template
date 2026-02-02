import { useTokenContext } from "@/contexts/token-context";
import { INSTALLMENTS, PIX_DISCOUNT_PERCENTAGE } from "@/data/constants";
import { formatCurrency, formatCurrencyNoSymbol } from "@/lib/utils";

interface ProductPriceProps {
  price?: number | string;
  className?: string;
  unavailableText?: string;
  variant?: "default" | "grid";
}

export function ProductPrice({
  price,
  className,
  unavailableText = "PREÇO INDISPONÍVEL",
  variant = "default",
}: ProductPriceProps) {
  const { user } = useTokenContext();
  const shouldShowPrice = !!user;

  const defaultStyles =
    variant === "grid"
      ? "text-xs md:text-base font-base"
      : "flex justify-start items-start text-sm md:text-xl font-base lg:text-xl";

  const finalClassName = className || defaultStyles;

  if (!shouldShowPrice || price === undefined || Number(price) === 0) {
    return <p className={finalClassName}>{unavailableText}</p>;
  }

  const priceNumber = typeof price === "string" ? Number(price) : price;
  const pixPrice = priceNumber * (1 - PIX_DISCOUNT_PERCENTAGE);
  const installmentValue = priceNumber / INSTALLMENTS;

  return (
    <div className="space-y-2 text-center md:text-start">
      <p className="text-3xl font-base leading-none text-gray-900">
        {formatCurrency(pixPrice)}
        <span className="ml-2 align-middle text-xs font-base text-gray-700">
          no PIX ({PIX_DISCOUNT_PERCENTAGE * 100}%)
        </span>
      </p>
      <div className="flex flex-row space-x-2 text-gray-600 justify-center md:justify-start">
        <p className="text-xl font-light">
          {formatCurrencyNoSymbol(priceNumber)}
        </p>
        <p className="text-md text-muted-foreground font-light">
          em até {INSTALLMENTS}x de {formatCurrency(installmentValue)}
        </p>
      </div>
    </div>
  );
}
