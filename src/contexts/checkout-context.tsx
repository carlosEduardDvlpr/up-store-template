"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { Address } from "@/data/types/addresses";
import { Telephone } from "@/data/types/telephone";

import { useCart } from "@/contexts/cart-context";
import { ShippingInfo } from "@/components/Checkout/CheckoutSection";
import { getShippingPriceAndDate } from "@/clients/database/get-shipping-price-and-date";
import { useUtmContext } from "./utm-contex";
import { registerWholesaleOrder } from "@/clients/database/register-wholesale-order";
import { useTokenContext } from "./token-context";
import { ToastError } from "@/components/Toaster/toast-error";
import { ToastSuccess } from "@/components/Toaster/toast-success";
import { useRouter } from "next/navigation";
import { MINIMUM_PURCHASE_ITEM_QUANTITY } from "@/data/constants";

interface CheckoutContextProps {
  currentStep: number;
  selectedAddress: Address | null;
  selectedPhone: Telephone | null;
  shippings: ShippingInfo[];
  selectedShipping: ShippingInfo | null;
  nextStep: () => void;
  prevStep: () => void;
  setSelectedAddress: (address: Address | null) => void;
  setSelectedPhone: (phone: Telephone | null) => void;
  setSelectedShipping: (shipping: ShippingInfo | null) => void;
  canProceedToNextStep: () => boolean;
  handleCompleteCheckout: () => Promise<void>;
  total: number;
}

const CheckoutContext = createContext<CheckoutContextProps | undefined>(
  undefined,
);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const { cart, resetCart } = useCart();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<Telephone | null>(null);

  const [shippings, setShippings] = useState<ShippingInfo[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingInfo | null>(
    null,
  );

  const { user: currentUser } = useTokenContext();
  const { utmParamsFirstSession, utmParamsCurrentSession, referrer } =
    useUtmContext();

  const items = useMemo(() => cart?.items ?? [], [cart?.items]);

  // ✅ Derivado: não vira state
  const shippingWeight = useMemo(() => {
    return items.reduce((total, sku) => total + 350 * sku.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, sku) => total + Number(sku.price_wholesale) * sku.quantity,
      0,
    );
  }, [items]);

  const total = useMemo(() => {
    return subtotal + (selectedShipping?.price ?? 0);
  }, [subtotal, selectedShipping?.price]);

  // ✅ Effect só para sincronizar fretes (sistema externo)
  useEffect(() => {
    if (!selectedAddress) return;
    if (items.length === 0) return;

    let cancelled = false;

    const syncShipping = async () => {
      const list = await getShippingPriceAndDate(
        selectedAddress.zip_code,
        shippingWeight,
      );

      if (cancelled) return;

      if (!list) return;

      // mantém seleção se existir no novo retorno
      setSelectedShipping((prev) => {
        if (!prev) return prev;
        const selected = list.find((s) => s.serviceCode === prev.serviceCode);
        return selected ? { ...prev, ...selected } : prev;
      });

      setShippings([
        ...list,
        {
          name: "Retirar na loja",
          maxDate: "",
          price: 0.0,
          serviceCode: "0",
        },
      ]);
    };

    syncShipping();

    return () => {
      cancelled = true;
    };
  }, [selectedAddress, shippingWeight, items.length]);

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return selectedAddress !== null && selectedPhone !== null;
      case 2:
        return selectedShipping !== null;
      default:
        return true;
    }
  };

  const handleCompleteCheckout = async () => {
    if (!currentUser || !selectedAddress || !selectedPhone || !cart?.id) {
      ToastError({
        title: "Complete Checkout",
        description:
          "Selecione o endereço, telefone e adicione pelo menos 1 item no carrinho para finalizar o pedido",
      });
      return;
    }

    if (items.length > 0) {
      const itemsQuantity = items.reduce((t, item) => t + item.quantity, 0);
      if (itemsQuantity < MINIMUM_PURCHASE_ITEM_QUANTITY) {
        ToastError({
          title: "Complete Checkout",
          description: `A quantidade mínima de items é de ${MINIMUM_PURCHASE_ITEM_QUANTITY}, seu carrinho contém apenas ${itemsQuantity} items.`,
        });
        return;
      }
    }

    const utm_source =
      utmParamsCurrentSession?.utm_source ??
      utmParamsFirstSession?.utm_source ??
      referrer ??
      undefined;

    const utm_medium =
      utmParamsCurrentSession?.utm_medium ??
      utmParamsFirstSession?.utm_medium ??
      undefined;

    const utm_campaign =
      utmParamsCurrentSession?.utm_campaign ??
      utmParamsFirstSession?.utm_campaign ??
      undefined;

    const utm_term =
      utmParamsCurrentSession?.utm_term ??
      utmParamsFirstSession?.utm_term ??
      "";

    const utm_content =
      utmParamsCurrentSession?.utm_content ??
      utmParamsFirstSession?.utm_content ??
      undefined;

    const orderData = {
      customer_id: currentUser.id,
      phone_id: selectedPhone.id,
      address_id: selectedAddress.id,
      shipping: selectedShipping
        ? {
            address_id: selectedAddress.id,
            phone_id: selectedPhone.id,
            service_code: selectedShipping.serviceCode ?? "0",
            pickup_date: selectedShipping.maxDate,
            observations: selectedShipping.observations,
          }
        : undefined,
      cart_id: cart.id,
      origin: {
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
      },
    };

    const data = await registerWholesaleOrder(orderData);

    if (data) {
      router.push(`/checkout/complete/${data.id}`);
      setSelectedPhone(null);
      setSelectedAddress(null);
      setSelectedShipping(null);
      setCurrentStep(1);
      resetCart();
      ToastSuccess({
        title: "Complete Order",
        description: "Pedido finalizado com sucesso.",
      });
      return;
    }

    ToastError({
      title: "ERROR - Complete Order",
      description: "Erro ao finalizar o pedido.",
    });
  };

  return (
    <CheckoutContext.Provider
      value={{
        currentStep,
        selectedAddress,
        selectedPhone,
        shippings,
        selectedShipping,
        nextStep,
        prevStep,
        setSelectedAddress,
        setSelectedPhone,
        setSelectedShipping,
        canProceedToNextStep,
        handleCompleteCheckout,
        total,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};
