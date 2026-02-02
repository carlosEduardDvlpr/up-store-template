"use client";

import { useState } from "react";
import { Divider } from "@/components/Divider";
import { useSearchParams } from "next/navigation";
import { User } from "@/data/types/user";
// import { CreditCardForm } from '@/components/Forms/Checkout/PagarMe/CreditCard'

import { Address } from "@/data/types/addresses";
import { Telephone } from "@/data/types/telephone";
import { ShippingInfo } from ".";
import { CreditCardForm } from "@/components/Forms/Checkout/CreditCard";
import { BoletoForm } from "@/components/Forms/Checkout/Boleto";
import { PixForm } from "@/components/Forms/Checkout/Pix";
import { formatCurrency } from "@/lib/utils";
import { useCheckout } from "@/contexts/checkout-context";

interface PaymentRadioProps {
  user: User;
  selectedAddress: Address | null;
  selectedPhone: Telephone | null;
  selectedShipping: ShippingInfo | null;
}

export default function PaymentRadio({
  user,
  selectedAddress,
  selectedPhone,
  selectedShipping,
}: PaymentRadioProps) {
  const searchParams = useSearchParams();
  const paymentParam = searchParams.get("payment-method");
  const [value, setValue] = useState("");
  const [showOptions, setShowOptions] = useState(true);
  const { total: totalCheckout } = useCheckout();
  const discount = { code: "CHEAPSKATE", amount: 0 };
  const total =
    totalCheckout - discount.amount + (selectedShipping?.price ?? 0);

  const paymentMethods = [
    {
      name: "Cartão de Crédito",
      value: "credit-card",
      description: "Até 6x sem juros",
      price: formatCurrency(total),
    },
    {
      name: "PIX",
      value: "pix",
      description: "Desconto 5%",
      price: formatCurrency(total - total * 0.05),
    },
    {
      name: "Boleto",
      value: "boleto",
      description: "Vencimento em 3 dias",
      price: formatCurrency(total),
    },
  ];

  if (!selectedAddress || !selectedPhone) {
    return (
      <div className="mt-6 flex w-full flex-col items-center text-center text-zinc-700 dark:text-zinc-100">
        <p className="text-sm font-base text-red-500 mb-4">
          Selecione o endereço de entrega, telefone e método de envio antes de
          prosseguir.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 p-4 rounded-none bg-white shadow-sm">
        {showOptions ? (
          <div className="mt-2 space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.value}
                className={`flex items-center justify-between p-3 border rounded-none cursor-pointer transition-all duration-200 ${(paymentParam || value) === method.value
                    ? "border-blue-500 bg-blue-50 opacity-100"
                    : "border-gray-300 opacity-50 hover:opacity-75"
                  }`}
                onClick={() => {
                  setValue(method.value);
                  setShowOptions(false);
                }}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={(paymentParam || value) === method.value}
                    onChange={() => {
                      setValue(method.value);
                      setShowOptions(false);
                    }}
                    className="form-radio h-5 w-5"
                  />
                </div>
                <div className="flex items-center justify-between w-full p-2">
                  <div className="flex items-center">
                    <span className="font-base text-base uppercase">
                      {method.name}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="font-base text-sm uppercase text-gray-500">
                      {method.description}
                    </span>
                    <span className="text-gray-500 text-sm font-base">
                      {method.price}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <div>
            {paymentMethods.map(
              (method) =>
                (paymentParam || value) === method.value && (
                  <label
                    key={method.value}
                    className="flex items-center justify-between p-3 border border-blue-500 bg-blue-50 rounded-none cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment-method"
                        checked
                        readOnly
                        className="form-radio h-5 w-5 text-blue-600 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between w-full p-2">
                      <div className="flex items-center">
                        <span className="font-base text-base uppercase">
                          {method.name}
                        </span>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="font-base text-sm uppercase text-gray-500">
                          {method.description}
                        </span>
                        <span className="text-gray-500 text-sm font-base">
                          {method.price}
                        </span>
                      </div>
                    </div>
                  </label>
                ),
            )}
          </div>
        )}
        {value && (
          <button
            className="flex w-full justify-center items-center mt-4 px-4 py-2 text-blue-400 text-xs hover:text-blue-600 transition-colors duration-200 uppercase"
            onClick={() => setShowOptions(true)}
          >
            Mostrar opções
          </button>
        )}
      </div>

      <Divider value="Informações de Pagamento" />
      <div className="transition-opacity duration-200">
        {(paymentParam || value) === "credit-card" &&
          user &&
          selectedAddress &&
          selectedPhone &&
          selectedShipping ? (
          <div>
            <CreditCardForm
              user={user}
              address={selectedAddress}
              phone={selectedPhone}
            />
          </div>
        ) : (paymentParam || value) === "pix" &&
          user &&
          selectedAddress &&
          selectedPhone &&
          selectedShipping ? (
          <div>
            <PixForm
              user={user}
              address={selectedAddress}
              phone={selectedPhone}
              selectedShipping={selectedShipping}
            />
            <div>
              <p className="font-base text-sm text-center text-zinc-700 dark:text-zinc-100">
                PIX ainda não disponível
              </p>
            </div>
          </div>
        ) : (paymentParam || value) === "boleto" &&
          user &&
          selectedAddress &&
          selectedPhone &&
          selectedShipping ? (
          <div>
            <BoletoForm
              user={user}
              address={selectedAddress}
              phone={selectedPhone}
              selectedShipping={selectedShipping}
            />
            <div>
              <p className="font-base text-sm text-center text-zinc-700 dark:text-zinc-100">
                Boleto ainda não disponível
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center pt-8">
            Selecione algum dos métodos de pagamento acima.
          </div>
        )}
      </div>
    </>
  );
}
