"use client";

import { useCart } from "@/contexts/cart-context";
import { getShippingPrice } from "@/lib/database";
import { removeNonNumericalChars } from "@/lib/utils";
import { useState } from "react";

export default function CalculateShippingForm() {
  const { cart } = useCart();
  const items = cart ? cart.items : [];
  const shippingWeight = items.reduce(
    (total, sku) => total + 350 * sku.quantity,
    0,
  );

  const [shippingCep, setShippingCep] = useState("");
  const [shippingCost, setShippingCost] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await getShippingPrice(shippingCep, shippingWeight);
      setShippingCost(data[0].price);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full p-2 md:p-4 font-base md:font-base border border-gray-300 rounded-none bg-white">
      <form id="calculate-shipping-value" onSubmit={handleSubmit}>
        <label
          htmlFor="shipping-cep"
          className="text-xs md:text-sm font-semibold text-gray-800"
        >
          CÁLCULO DE FRETE
        </label>
        <div className="flex items-center mt-2 space-x-2">
          <input
            type="text"
            id="shipping-cep"
            name="shipping-cep"
            placeholder="Digite seu CEP"
            value={shippingCep}
            onChange={(e) =>
              setShippingCep(removeNonNumericalChars(e.target.value))
            }
            className="w-full border border-gray-300 px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm text-gray-700 rounded-none focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium rounded-none hover:bg-gray-900"
          >
            CALCULAR
          </button>
        </div>
      </form>

      {shippingCost && (
        <div className="mt-3 p-3 border border-gray-200 bg-gray-100 rounded-none flex justify-between items-center">
          <div className="text-xs md:text-sm text-gray-700">
            <span className="font-semibold">SEDEX</span> - ATÉ 3 DIAS ÚTEIS
          </div>
          <div className="text-xs md:text-base font-semibold text-gray-900">
            R$ {shippingCost}
          </div>
        </div>
      )}
    </div>
  );
}
