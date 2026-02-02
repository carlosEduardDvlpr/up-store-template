import { useProductCard } from "@/contexts/product-card-context";

export function ColorPicker() {
  const { selectedColor, handleColorChange, product } = useProductCard();
  return (
      <div className="flex gap-1.5 pt-1">
        {product.colors.map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorChange(color)}
            className={`w-4 h-4 border transition-all cursor-pointer hover:scale-110 
              ${selectedColor === color
                ? "border-foreground ring-1 ring-foreground ring-offset-1"
                : "border-border"
              }`}
            style={{
              backgroundColor: color.background_color || "white",
            }}
            aria-label={`Color ${index + 1}`}
          />
        ))}
      </div>
  );
}
