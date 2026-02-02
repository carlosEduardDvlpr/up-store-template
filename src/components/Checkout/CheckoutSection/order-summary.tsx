"use client";

import { Divider } from "@/components/Divider";
import { Telephone } from "@/data/types/telephone";
import { useCart } from "@/contexts/cart-context";
import { formatCurrency } from "@/lib/utils";
import { useCheckout } from "@/contexts/checkout-context";

// UF -> full state name (Brazil)
const BR_STATES: Record<string, string> = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

function formatPhone(phone: Telephone | null) {
  if (!phone) return "";
  const n = phone.number?.replace(/\D/g, "") ?? "";
  const local =
    n.length === 9
      ? `${n.slice(0, 5)}-${n.slice(5)}`
      : `${n.slice(0, 4)}-${n.slice(4)}`;
  return `(${phone.ddd_code}) ${local}`;
}

function formatZip(zip?: string) {
  const z = (zip ?? "").replace(/\D/g, "");
  return z.length === 8 ? `${z.slice(0, 5)}-${z.slice(5)}` : (zip ?? "");
}

export default function CheckoutOrderSummary() {
  const { selectedAddress, selectedPhone, selectedShipping } = useCheckout();

  const { cart } = useCart();
  const discount = { code: null, amount: 0 };

  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (total, sku) => total + Number(sku.price_wholesale) * sku.quantity,
    0,
  );
  const shipping = selectedShipping?.price ?? 0;
  const total = subtotal - discount.amount + shipping;

  if (!selectedAddress || !selectedPhone) {
    return (
      <div className="mt-6 flex w-full flex-col items-center text-center text-zinc-700 dark:text-zinc-100">
        <p className="mb-4 text-sm font-base text-red-500">
          Selecione o endereço de entrega, telefone e método de envio antes de
          prosseguir.
        </p>
      </div>
    );
  }

  const statePretty =
    BR_STATES[selectedAddress.state as keyof typeof BR_STATES] ??
    selectedAddress.state;

  return (
    <>
      <Divider value="Detalhes do pedido" />
      <div className="transition-opacity duration-200">
        <section
          aria-labelledby="order-heading"
          className="bg-gray-50 px-4 py-6 sm:px-6"
        >
          <div className="mx-auto w-full">
            {/* Customer / Delivery summary */}
            <div className="flex flex-col gap-4">
              {/* Address */}
              <div className="w-full rounded-lg border border-gray-200 bg-white p-4">
                <p className="mb-2 text-xs font-medium uppercase text-gray-500">
                  Endereço de Entrega
                </p>
                <p className="text-sm text-gray-900">
                  {selectedAddress.street}
                  {selectedAddress.number ? `, ${selectedAddress.number}` : ""}
                  {selectedAddress.complement
                    ? ` • ${selectedAddress.complement}`
                    : ""}
                </p>
                <p className="text-sm text-gray-700">
                  {selectedAddress.neighborhood}
                </p>
                <p className="text-sm text-gray-700">
                  {selectedAddress.city} • {statePretty} (
                  {selectedAddress.state})
                </p>
                <p className="text-sm text-gray-700">
                  CEP {formatZip(selectedAddress.zip_code)}
                </p>
              </div>

              {/* Phone */}
              <div className="w-full rounded-lg border border-gray-200 bg-white p-4">
                <p className="mb-2 text-xs font-medium uppercase text-gray-500">
                  Telefone
                </p>
                <p className="text-sm text-gray-900">
                  {formatPhone(selectedPhone)}
                </p>
              </div>

              {/* Shipping */}
              {selectedShipping ? (
                <div className="w-full rounded-lg border border-gray-200 bg-white p-4">
                  <p className="mb-2 text-xs font-medium uppercase text-gray-500">
                    Frete Selecionado
                  </p>
                  <p className="text-sm text-gray-900">
                    {selectedShipping?.name ?? "—"}
                  </p>
                  <p className="text-sm text-gray-700">
                    Código: {selectedShipping?.serviceCode ?? "—"}
                  </p>
                  <p className="text-sm text-gray-700">
                    Entrega até: {selectedShipping?.maxDate ?? "—"}
                  </p>
                  <p className="text-sm text-gray-900">
                    {`R$ ${(selectedShipping?.price ?? 0).toFixed(2)}`}
                  </p>
                </div>
              ) : null}
            </div>
            <dl className="mt-10 space-y-6 text-sm font-base uppercase text-gray-700">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="text-gray-900">{`R$ ${subtotal.toFixed(2)}`}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex">
                  Desconto
                  {discount.code ? (
                    <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
                      {discount.code}
                    </span>
                  ) : null}
                </dt>
                <dd className="text-gray-900">
                  -{`R$ ${discount.amount.toFixed(2)}`}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Frete</dt>
                <dd className="text-gray-900">
                  {formatCurrency(selectedShipping?.price ?? 0)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                <dt className="text-base">Total</dt>
                <dd className="text-base">{`R$ ${total.toFixed(2)}`}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </>
  );
}
