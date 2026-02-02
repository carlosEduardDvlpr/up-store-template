"use client";

import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { User } from "@/data/types/user";
import { useCart } from "@/contexts/cart-context";
import { LockIcon } from "lucide-react";
import { PurchaseButton } from "@/components/Checkout/purchase-button";
import { Address } from "@/data/types/addresses";
import { Telephone } from "@/data/types/telephone";
import { ShippingInfo } from "@/components/Checkout/CheckoutSection";
import { useUtmContext } from "@/contexts/utm-contex";
import { createPixOrder } from "@/lib/database";
import { ToastError } from "@/components/Toaster/toast-error";
import { ToastSuccess } from "@/components/Toaster/toast-success";

interface PixFormProps {
  user: User;
  address: Address | null;
  phone: Telephone | null;
  selectedShipping: ShippingInfo | null;
}

const discount = { code: "CHEAPSKATE", amount: 0.0 };

const newOrderFormSchema = zod.z.object({
  pix: zod.object({
    expires_in: zod.number(), // in minutes
  }),
  addressId: zod.string(),
  phoneId: zod.string(),
  userId: zod.string(),
  user_name: zod.string(),
  user_email: zod.string(),
  user_cpf: zod.string(),
  user_cnpj: zod.string(),
  shipping_service_code: zod.string(),
  shipping_service_name: zod.string(),
  shipping_value: zod.number(),
  discount_value: zod.number(),
  total_value: zod.number(),
  payment_method: zod.string(),
  payment_installments: zod.number(),
  utm_source: zod.string().optional(),
  utm_medium: zod.string().optional(),
  utm_campaign: zod.string().optional(),
  utm_term: zod.string().optional(),
  utm_content: zod.string().optional(),
  items: zod.array(
    zod.object({
      code: zod.string(),
      amount: zod.number(),
      description: zod.string().optional(),
      quantity: zod.number(),
    }),
  ),
});

export type NewPixOrderFormData = zod.infer<typeof newOrderFormSchema>;

export function PixForm({
  user,
  address,
  phone,
  selectedShipping,
}: PixFormProps) {
  const router = useRouter();
  const { cart } = useCart();
  const items = cart ? cart.items : [];
  const { utmParamsFirstSession, utmParamsCurrentSession, referrer } =
    useUtmContext();
  const subtotal = items.reduce(
    (total, sku) => total + Number(sku.price_wholesale) * sku.quantity,
    0,
  );
  const shipping = selectedShipping?.price ?? 0;

  const total = subtotal - discount.amount + shipping;

  const currentDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(currentDate.getDate() + 3);

  const {
    handleSubmit,
    reset,
    // formState: { errors },
  } = useForm<NewPixOrderFormData>({
    resolver: zodResolver(newOrderFormSchema),
    defaultValues: {
      pix: {
        expires_in: 60 * 3, // 3 hours
      },
      phoneId: phone?.id ?? "",
      addressId: address?.id ?? "",
      userId: user.id,
      user_name: user?.name ?? "",
      user_email: user?.email ?? "",
      user_cpf: user?.cpf ?? "",
      user_cnpj: user?.cnpj ?? "",
      shipping_service_code: selectedShipping?.serviceCode ?? "",
      shipping_service_name: selectedShipping?.name ?? "",
      shipping_value: shipping,
      discount_value: discount.amount,
      total_value: total,
      payment_method: "pix",
      payment_installments: 1,
      utm_source:
        utmParamsCurrentSession?.utm_source ??
        utmParamsFirstSession?.utm_source ??
        referrer ??
        "",
      utm_medium:
        utmParamsCurrentSession?.utm_medium ??
        utmParamsFirstSession?.utm_medium ??
        "",
      utm_campaign:
        utmParamsCurrentSession?.utm_campaign ??
        utmParamsFirstSession?.utm_campaign ??
        "",
      utm_term:
        utmParamsCurrentSession?.utm_term ??
        utmParamsFirstSession?.utm_term ??
        "",
      utm_content:
        utmParamsCurrentSession?.utm_content ??
        utmParamsFirstSession?.utm_content ??
        "",
      items: items.map((item) => ({
        code: item.sku_code,
        amount: Number(item.price_wholesale),
        description: item.sku_title,
        quantity: item.quantity,
      })),
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateNewOrder(data: NewPixOrderFormData) {
    setIsLoading(true);
    try {
      const response = await createPixOrder(data);
      event?.preventDefault();

      if (response.orderId) {
        reset();
        router.push(`/checkout/complete/${response.orderId}`);
        ToastSuccess({
          title: "Pedido PIX",
          description: "Pedido realizado com sucesso!",
        });
        // const { charges } = await response.json()

        return;
      }

      if (response.message) {
        ToastError({
          title: "Pedido PIX",
          description: response.message,
        });
      }
    } catch (error) {
      ToastError({
        title: "Pedido PIX",
        description: "Erro ao processar o pedido, tente novamente mais tarde.",
        jsonError: JSON.stringify(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      id="create-order-pagarme-pix"
      onSubmit={handleSubmit(
        (data) => {
          handleCreateNewOrder(data);
        },
        (errors) => {
          console.error("Form validation errors:", errors);
        },
      )}
      className="mt-6 flex w-full flex-col gap-5 divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-100"
    >
      <PurchaseButton
        total={total}
        form="create-order-pagarme-pix"
        isLoading={isLoading}
      />

      <p className="mt-6 pt-6 flex justify-center text-sm font-medium text-gray-500 mb-6">
        <LockIcon className="mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
        Gerar pagamento por PIX. Prazo de 3 dias corridos para o pagamento.
      </p>
    </form>
  );
}
