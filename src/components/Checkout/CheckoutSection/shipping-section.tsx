"use client";

import { useState } from "react";
import { ShippingInfo } from ".";
import { useCheckout } from "@/contexts/checkout-context";
import { getDistanceInDays } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

type ShippingInfoWithObs = ShippingInfo & { observations?: string };

export default function ShippingSection() {
  const { shippings, setSelectedShipping, selectedShipping } = useCheckout();
  const [pickupDate, setPickupDate] = useState<string>("");
  const [observations, setObservations] = useState<string>("");

  if (!shippings || shippings.length === 0) {
    return (
      <div className="flex justify-center items-center my-4 py-4">
        <span className="text-gray-500 block font-base sm:inline mt-2 text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right">
          Volte para a primeira etapa e selecione um endereço.
        </span>
      </div>
    );
  }

  const handleShippingClick = (item: ShippingInfo) => {
    const isPickup = item.serviceCode === "0";

    if (isPickup) {
      // For pickup, only expand - don't set selection yet
      if (selectedShipping?.name !== item.name || !pickupDate) {
        setSelectedShipping({
          name: "Retirar na loja",
          maxDate: "",
          price: 0.0,
          serviceCode: "0",
        });
        setPickupDate("");
        setObservations("");
      }
    } else {
      setSelectedShipping(item);
      setPickupDate("");
      setObservations("");
    }
  };
  const handlePickupDateChange = (item: ShippingInfo, date: string) => {
    setPickupDate(date);
    const isPickup = item.serviceCode === "0";
    if (date && isPickup) {
      setSelectedShipping({ ...item, maxDate: date });
    } else {
      setSelectedShipping(null);
    }
  };

  const handleObservationsChange = (text: string) => {
    setObservations(text);

    if (!selectedShipping) return;

    setSelectedShipping({
      ...(selectedShipping as ShippingInfoWithObs),
      observations: text,
    });
  };

  const getTimeDistanceText = (maxDate: string, isPickup: boolean = false) => {
    const days = getDistanceInDays(new Date(maxDate));
    const prefix = isPickup
      ? "Retirada em aproximadamente"
      : "Entrega em aproximadamente";
    return days > 1 ? `${prefix} ${days} dias` : `${prefix} algumas horas`;
  };

  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="w-full pt-4">
      <div className="mt-2 space-y-3">
        {shippings.map((item, index) => {
          const isPickup = item.serviceCode === "0";
          const isSelected = selectedShipping?.name === item.name;

          return (
            <div
              key={index}
              className={`border rounded-none transition-all ${isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => handleShippingClick(item)}
              >
                <div className="flex items-center gap-3">
                  {isSelected && (
                    <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <span className="font-medium">{item.name}</span>
                </div>

                <div className="flex flex-col items-end">
                  {!isPickup ? (
                    <>
                      <div className="text-gray-900 font-semibold">
                        R$ {item.price}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {getTimeDistanceText(item.maxDate, isPickup)}
                      </div>
                    </>
                  ) : pickupDate ? (
                    <div className="text-gray-500 text-sm">
                      Funcionamento das 8:00 as 17:00
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      Selecione a data
                    </div>
                  )}
                </div>
              </div>

              {isPickup && isSelected && (
                <>
                  <div className="pb-2 border-y-2 border-red-400 bg-red-200">
                    <div className="py-2 mb-2 flex flex-row justify-center text-center border-b border-red-400">
                      <span className="inline-flex items-center gap-2 text-lg font-base text-red-700 uppercase tracking-wider">
                        <AlertTriangle className="w-8 h-8" />
                        Atenção
                      </span>
                    </div>

                    <ul className="flex flex-col gap-2 px-4">
                      <li className="flex items-start gap-2 text-md font-thin text-red-700">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-700" />
                        <span>
                          Entregas em até 10 min de distância, acima disso será
                          cobrado a taxa do Motoboy.
                        </span>
                      </li>

                      <li className="flex items-start gap-2 text-md font-thin text-red-700">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-700" />
                        <span>
                          Depois da compra, confirmar data de retirada com seu
                          vendedor.
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="px-4 pb-4 border-t pt-3">
                    <label className="block text-md font-medium text-gray-700 mb-2">
                      Data de retirada
                    </label>
                    <input
                      type="datetime-local"
                      value={pickupDate}
                      onChange={(e) =>
                        handlePickupDateChange(item, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={getMinDate()}
                      max={getMaxDate()}
                    />
                    <div className="mt-4">
                      <label className="block text-md font-medium text-gray-700 mb-2">
                        Observações para entrega/retirada
                      </label>
                      <textarea
                        value={observations}
                        onChange={(e) =>
                          handleObservationsChange(e.target.value)
                        }
                        disabled={!selectedShipping}
                        placeholder={
                          selectedShipping
                            ? "Ex.: Representante Ana vai retirar, Entrega na Mega Polo ônibus placa, Transportadora Braspress"
                            : "Selecione um serviço de frete para adicionar observações"
                        }
                        className={`w-full min-h-28 resize-none border rounded-md px-3 py-2 text-sm
    focus:outline-none focus:ring-2 focus:ring-gray-500
    ${!selectedShipping
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : "border-gray-300"
                          }`}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
