import { useProductCard } from "@/contexts/product-card-context";

export function SizePicker() {
  const { selectedColor, selectedSize, handleSizeChange, product } =
    useProductCard();
  // Function to check if a size is in stock based on selected color and available stock
  const isSizeInStock = (sizeCode: string) => {
    const matchingSku = product.skus?.find(
      (sku) =>
        sku.color_code === selectedColor?.code && sku.size_code === sizeCode,
    );
    return matchingSku ? matchingSku.stock_available > 0 : false;
  };

  return (
    <div className="flex gap-1 pt-1 flex-wrap">
      {product.sizes?.map((size, index) => {
        const inStock = isSizeInStock(size.code);

        return (
          <div key={index} className="flex items-center space-x-2">
            {/* Size button */}
            <button
              key={index}
              onClick={() => inStock && handleSizeChange(size)}
              className={`w-7 h-7 border text-[9px] font-light transition-all cursor-pointer hover:bg-foreground hover:text-background 
              ${selectedSize?.code === size.code
                  ? "bg-foreground text-background border-foreground"
                  : "border-border bg-background text-foreground"
                }`}
            >
              {size.title}
            </button>
          </div>
        );
      })}
    </div>
  );
}
