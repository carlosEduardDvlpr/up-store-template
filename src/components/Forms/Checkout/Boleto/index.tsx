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
import { createBoletoOrder } from "@/lib/database";
import { ToastError } from "@/components/Toaster/toast-error";
import { ToastSuccess } from "@/components/Toaster/toast-success";

interface BoletoFormProps {
  user: User;
  address: Address | null;
  phone: Telephone | null;
  selectedShipping: ShippingInfo | null;
}

const discount = { code: "CHEAPSKATE", amount: 0.0 };

const newOrderFormSchema = zod.z.object({
  address_id: zod.string(),
  phone_id: zod.string(),
  user_id: zod.string(),
  shipping_service_code: zod.string(),
  origin: zod.object({
    utm_source: zod.string().optional(),
    utm_medium: zod.string().optional(),
    utm_campaign: zod.string().optional(),
    utm_term: zod.string().optional(),
    utm_content: zod.string().optional(),
  }),
  payment: zod.object({
    payment_method: zod.string(),
    payment_installments: zod.number().default(1),
    customer: zod
      .object({
        name: zod.string(),
        cpf: zod.string().optional(),
        cnpj: zod.string().optional(),
      })
      .optional(),
    boleto: zod.object({
      instructions: zod.string(),
      due_at: zod.date(),
      nosso_numero: zod.string(),
      type: zod.string(),
      document_number: zod.string(),
    }),
  }),
  cart: zod.object({
    id: zod.string(),
    items: zod.array(
      zod.object({
        code: zod.string(),
        quantity: zod.number(),
      }),
    ),
  }),
});

export type NewBoletoOrderFormData = zod.infer<typeof newOrderFormSchema>;

export function BoletoForm({
  user,
  address,
  phone,
  selectedShipping,
}: BoletoFormProps) {
  const router = useRouter();
  const { cart } = useCart();
  const items = cart ? cart.items : [];
  const [isLoading, setIsLoading] = useState(false);
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
  } = useForm<NewBoletoOrderFormData>({
    resolver: zodResolver(newOrderFormSchema),
    defaultValues: {
      payment: {
        payment_method: "boleto",
        payment_installments: 1,
        customer: {
          name: "",
          cpf: user.cpf,
          cnpj: user.cnpj,
        },
        boleto: {
          instructions: "Pagar em até 3 dias corridos.",
          due_at: dueDate,
          nosso_numero: "123456",
          type: "DM",
          document_number: "123456789",
        },
      },
      phone_id: phone?.id ?? "",
      address_id: address?.id ?? "",
      user_id: user.id,
      shipping_service_code: selectedShipping?.serviceCode ?? "",
      cart: {
        id: cart?.id,
        items: items.map((item) => ({
          code: item.sku_code,
          quantity: item.quantity,
        })),
      },
      origin: {
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
      },
    },
  });

  async function handleCreateNewOrder(data: NewBoletoOrderFormData) {
    setIsLoading(true);
    try {
      const response = await createBoletoOrder(data);
      event?.preventDefault();

      if (response.orderId) {
        reset();
        router.push(`/checkout/complete/${response.orderId}`);
        ToastSuccess({
          title: "Pedido",
          description: "Pedido realizado com sucesso!",
        });
        // const { charges } = await response.json()

        return;
      }

      if (response.message) {
        ToastError({
          title: "Pedido",
          description: response.message,
        });
      }
    } catch (error) {
      ToastError({
        title: "Pedido",
        description: "Erro ao cadastrar o pedido",
        jsonError: JSON.stringify(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      id="create-order-pagarme-boleto"
      onSubmit={handleSubmit(
        (data) => {
          handleCreateNewOrder(data); // Call your actual function here
        },
        (errors) => {
          console.error("Form validation errors:", errors); // Handle form validation errors here
        },
      )}
      className="mt-6 flex w-full flex-col gap-5 divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-100"
    >
      <PurchaseButton
        total={total}
        form="create-order-pagarme-boleto"
        isLoading={isLoading}
      />

      <p className="mt-6 pt-6 flex justify-center text-sm font-medium text-gray-500 mb-6">
        <LockIcon className="mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
        Gerar boleto bancário. Prazo de 3 dias corridos para o pagamento.
      </p>
    </form>
  );
}
