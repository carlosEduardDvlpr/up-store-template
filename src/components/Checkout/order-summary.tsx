"use client";

import { useCart } from "@/contexts/cart-context";
import { CartBody } from "./cart-body";
import { useState } from "react";
import { groupProductsByName } from "@/lib/product-helpers";
import { useCheckout } from "@/contexts/checkout-context";

const discount = { code: null, amount: 0 };

export function OrderSummary() {
  const { cart } = useCart();
  const { selectedShipping } = useCheckout();
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(true);
  const items = cart ? cart.items : [];
  const groupedItems = groupProductsByName(items);
  const subtotal = items
    ? items.reduce(
        (total, sku) => total + Number(sku.price_wholesale) * sku.quantity,
        0,
      )
    : 0;
  const shipping = selectedShipping?.price ?? 0;
  const total = subtotal - discount.amount + shipping;

  return (
    <>
      {/* Mobile Order Summary */}
      <section
        aria-labelledby="order-heading"
        className="bg-gray-50 px-4 py-6 sm:px-6 lg:hidden"
      >
        <div className="mx-auto w-full">
          <div className="flex items-center justify-between">
            <h2
              id="order-heading"
              className="text-base font-base text-gray-900 uppercase"
            >
              Meu pedido
            </h2>
            <button
              onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
              className="font-base text-base uppercase border-2 p-2 text-gray-600 hover:text-gray-500"
            >
              <span>
                {isMobileSummaryOpen ? "Fechar resumo" : "Abrir resumo"}
              </span>
            </button>
          </div>

          {isMobileSummaryOpen && (
            <>
              <div className="mt-6">
                <CartBody groupedItems={groupedItems} />
              </div>

              <form className="mt-10">
                <label
                  htmlFor="discount-code-mobile"
                  className="block text-sm font-base text-gray-900 uppercase"
                >
                  Código do cupom
                </label>
                <div className="mt-1 flex space-x-4">
                  <input
                    type="text"
                    id="discount-code-mobile"
                    name="discount-code-mobile"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-gray-200 px-4 text-sm font-base uppercase text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    Adicionar
                  </button>
                </div>
              </form>

              <dl className="mt-10 space-y-6 text-sm font-base uppercase text-gray-700">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-gray-900">{`R$ ${subtotal.toFixed(
                    2,
                  )}`}</dd>
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
                    - {`R$ ${discount?.amount?.toFixed(2)}`}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Frete</dt>
                  <dd className="text-gray-900">{`R$ ${
                    shipping?.toFixed(2) ?? "0"
                  }`}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">{`R$ ${total.toFixed(2)}`}</dd>
                </div>
              </dl>
            </>
          )}
        </div>
      </section>

      {/* Mobile Toggle Button */}
      <div className="fixed bottom-4 right-4 z-10 lg:hidden">
        <button
          onClick={() => setIsMobileSummaryOpen(true)}
          className={`rounded-full bg-gray-900 p-3 text-white shadow-lg transition-opacity ${
            isMobileSummaryOpen ? "hidden" : "block"
          }`}
        >
          <span className="sr-only">Abrir resumo do pedido</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </button>
      </div>

      {/* Desktop Order Summary */}
      <section
        aria-labelledby="summary-heading"
        className="hidden w-full min-w-[40vw] max-w-md flex-col bg-gray-50 lg:flex"
      >
        <h2 id="summary-heading" className="sr-only">
          Resumo do pedido
        </h2>

        <div className="flex-auto divide-y divide-gray-200 overflow-y-auto px-6">
          <CartBody groupedItems={groupedItems} />
        </div>

        <div className="sticky bottom-0 flex-none border-t border-gray-200 bg-gray-50 p-6">
          <form>
            <label
              htmlFor="discount-code"
              className="block text-sm font-base text-gray-900 uppercase pt-4"
            >
              Código do cupom
            </label>
            <div className="mt-1 flex space-x-4">
              <input
                type="text"
                id="discount-code"
                name="discount-code"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
              />
              <button
                type="submit"
                className="rounded-md bg-gray-200 px-4 text-sm font-base uppercase text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Adicionar
              </button>
            </div>
          </form>

          <dl className="mt-10 space-y-6 text-sm font-base uppercase text-gray-700">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="text-gray-900">{`R$ ${subtotal.toFixed(2)}`}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="flex">
                Desconto
                <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
                  {discount.code}
                </span>
              </dt>
              <dd className="text-gray-900">
                -{`R$ ${discount?.amount?.toFixed(2)}`}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Frete</dt>
              <dd className="text-gray-900">{`R$ ${
                shipping?.toFixed(2) ?? "0"
              }`}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
              <dt className="text-base">Total</dt>
              <dd className="text-base">{`R$ ${total.toFixed(2)}`}</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
