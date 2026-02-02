"use client";

import { Controller, useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Input from "@/components/Input";

import { useRouter } from "next/navigation";

import { User } from "@/data/types/user";
import { useCart } from "@/contexts/cart-context";
import { LockIcon } from "lucide-react";
import { PurchaseButton } from "@/components/Checkout/purchase-button";
import { Address } from "@/data/types/addresses";
import { Telephone } from "@/data/types/telephone";
import { useUtmContext } from "@/contexts/utm-contex";
import { useState } from "react";
import {
  createOrder,
  // ,getCreditCardToken
} from "@/lib/database";
import { ToastError } from "@/components/Toaster/toast-error";
import { ToastSuccess } from "@/components/Toaster/toast-success";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { useCheckout } from "@/contexts/checkout-context";

interface CreditCardFormProps {
  user: User;
  address: Address;
  phone: Telephone;
}

const discount = { code: "CHEAPSKATE", amount: 0.0 };
const installments = [
  {
    value: "1",
    interest: "0%",
  },
  {
    value: "2",
    interest: "0%",
  },
  {
    value: "3",
    interest: "0%",
  },
  {
    value: "4",
    interest: "0%",
  },
  {
    value: "5",
    interest: "0%",
  },
  {
    value: "6",
    interest: "0%",
  },
];

const newOrderFormSchema = zod.z.object({
  payments: zod.array(
    zod.object({
      credit_card: zod.object({
        card: zod.object({
          number: zod
            .string({ message: "Número do cartão inválido" })
            .min(1, { message: "Número do cartão inválido" })
            .max(16, { message: "Número do cartão inválido" }),
          holder_name: zod
            .string()
            .min(3, { message: "Nome do titular inválido" })
            .max(100, { message: "Nome do titular inválido" }),
          exp_month: zod.coerce
            .number()
            .min(1, { message: "Mês inválido" })
            .max(12, { message: "Mês inválido" }),
          exp_year: zod.coerce.number().min(2025, { message: "Ano inválido" }),
          cvv: zod
            .string({ message: "CVV inválido" })
            .min(3, { message: "CVV inválido" })
            .max(4, { message: "CVV inválido" }),
        }),
      }),
    }),
  ),
  address_id: zod.string(),
  phone_id: zod.string(),
  shipping_service_code: zod.string(),
  cart: zod.object({
    id: zod.string(),
    items: zod.array(
      zod.object({
        code: zod.string(),
        quantity: zod.number(),
      }),
    ),
  }),
  payment: zod.object({
    payment_method: zod.string(),
    payment_installments: zod.coerce
      .number({ message: "Parcelas inválidas" })
      .min(1, { message: "Parcelas inválidas" })
      .max(6, { message: "Parcelas inválidas" })
      .default(1),
    customer: zod
      .object({
        name: zod.string(),
        cpf: zod.string().optional(),
        cnpj: zod.string().optional(),
      })
      .optional(),
    card: zod
      .object({
        card_token: zod.string(),
      })
      .optional(),
  }),
  origin: zod.object({
    utm_source: zod.string().optional(),
    utm_medium: zod.string().optional(),
    utm_campaign: zod.string().optional(),
    utm_term: zod.string().optional(),
    utm_content: zod.string().optional(),
  }),
});

export type NewOrderFormData = zod.infer<typeof newOrderFormSchema>;

export function CreditCardForm({ user, address, phone }: CreditCardFormProps) {
  const { selectedShipping } = useCheckout();
  const router = useRouter();
  const { cart, resetCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const items = cart ? cart?.items : [];
  const { utmParamsFirstSession, utmParamsCurrentSession, referrer } =
    useUtmContext();
  const subtotal =
    items && items.length
      ? items.reduce(
          (total, sku) => total + Number(sku.price_wholesale) * sku.quantity,
          0,
        )
      : 0;

  const shipping = selectedShipping?.price ?? 0;

  const total = Math.round((subtotal - discount.amount + shipping) * 100) / 100;

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
    utmParamsCurrentSession?.utm_term ?? utmParamsFirstSession?.utm_term ?? "";
  const utm_content =
    utmParamsCurrentSession?.utm_content ??
    utmParamsFirstSession?.utm_content ??
    undefined;

  const {
    handleSubmit,
    reset,
    register,
    control,
    // watch,
    // formState: { errors },
  } = useForm<NewOrderFormData>({
    resolver: zodResolver(newOrderFormSchema),
    defaultValues: {
      payments: [
        {
          credit_card: {
            card: {
              number: "",
              holder_name: "",
              cvv: "",
            },
          },
        },
      ],
      payment: {
        payment_method: "credit_card",
        payment_installments: 1,
        customer: {
          name: user.name,
          cpf: user.cpf,
          cnpj: user.cnpj,
        },
      },
      phone_id: phone.id,
      address_id: address.id,
      shipping_service_code: selectedShipping?.serviceCode ?? "",
      cart: {
        id: cart?.id,
        items: items.map((item) => ({
          code: item.sku_code,
          quantity: item.quantity,
        })),
      },
      origin: {
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
      },
    },
  });

  if (!phone || !user || !selectedShipping || !cart || !cart.items.length) {
    return <div>Loading checkout data...</div>;
  }

  async function handleCreateNewOrder(data: NewOrderFormData) {
    if (!user.cnpj) {
      ToastError({
        title: "Pedido",
        description: "Vendas apenas para pessoas jurídicas.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const card = {
        number: data.payments[0].credit_card.card.number,
        holder_name: data.payments[0].credit_card.card.holder_name,
        exp_month: data.payments[0].credit_card.card.exp_month,
        exp_year: data.payments[0].credit_card.card.exp_year,
        cvv: data.payments[0].credit_card.card.cvv,
      };
      // const cardResponse = await getCreditCardToken({
      //   type: 'card',
      //   email: user.email,
      //   card,
      // })

      // // Check if the card token was created successfully
      // if (!cardResponse.token) {
      //   ToastError({
      //     title: 'Cartão',
      //     description: 'Informações do cartão inválidas.',
      //   })
      //   return
      // }

      const checkoutBody = {
        ...data,
        payment: {
          ...data.payment,
          card: {
            // card_token: cardResponse.token,
            // brand: cardResponse.card_brand,
            ...card,
          },
        },
      };

      const response = await createOrder(checkoutBody);
      event?.preventDefault();

      if (response.orderId) {
        reset();
        resetCart();
        router.push(`/checkout/complete/${response.orderId}`);
        ToastSuccess({
          title: "Pedido",
          description: "Pedido realizado com sucesso!",
        });
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
        description: "Erro ao processar o pedido, tente novamente mais tarde.",
        jsonError: JSON.stringify(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (
    !user ||
    !address ||
    !phone ||
    !selectedShipping ||
    !items ||
    !cart ||
    !cart.items ||
    !user.id
  ) {
    return (
      <div className="mt-6 flex w-full flex-col gap-5 divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-100">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md mb-4">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
            Informações necessárias
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Para prosseguir com o pagamento, antes você precisa:
            {!user && (
              <span className="text-sm font-base text-red-500 dark:text-red-500">
                Estar cadastrado no site
              </span>
            )}
            {!user.cpf && !user.cnpj && (
              <span className="text-sm font-base text-red-500 dark:text-red-500">
                Ter o CNPJ ou CPF cadastrado na conta
              </span>
            )}
            {!address && (
              <span className="text-sm font-base text-red-500 dark:text-red-500">
                Ter um endereço cadastrado e selecionado
              </span>
            )}
            {!phone && (
              <span className="text-sm font-base text-red-500 dark:text-red-500">
                Ter um telefone cadastrado e selecionado
              </span>
            )}
            {!selectedShipping && (
              <span className="text-sm font-base text-red-500 dark:text-red-500">
                Ter um método de entrega selecionado
              </span>
            )}
            {!items ||
              !cart ||
              (!cart.items && (
                <span className="text-sm font-base text-red-500 dark:text-red-500">
                  Ter pelo menos um produto no carrinho
                </span>
              ))}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      id="create-order-checkout"
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
      <div className="grid grid-cols-12 gap-x-4 gap-y-6">
        {/* Titular */}
        <div className="col-span-full">
          <label
            htmlFor="holder_name"
            className="block text-sm font-base uppercase text-gray-700"
          >
            Titular do Cartão
            {/* {errors.name-on-card && (
                  <span className="text-sm font-normal text-red-500 dark:text-red-500">
                    {errors.name-on-card.message}
                  </span>
                )} */}
          </label>
          <div className="mt-1">
            <Input.Root>
              <Input.Control
                id="holder_name"
                type="text"
                required
                {...register("payments.0.credit_card.card.holder_name")}
              />
            </Input.Root>
          </div>
        </div>

        {/* card-number */}
        <div className="col-span-full">
          <label
            htmlFor="card-number"
            className="block text-sm font-base uppercase text-gray-700"
          >
            Número do cartão
            {/* {errors.card-number && (
                  <span className="text-sm font-normal text-red-500 dark:text-red-500">
                    {errors.card-number.message}
                  </span>
                )} */}
          </label>
          <div className="mt-1">
            <Input.Root>
              <Input.Control
                id="card-number"
                type="card-number"
                required
                {...register("payments.0.credit_card.card.number")}
              />
            </Input.Root>
          </div>
        </div>

        {/* expiration month */}
        <div className="col-span-4 sm:col-span-4">
          <label
            htmlFor="exp_month"
            className="block text-sm font-base text-gray-700"
          >
            Mês Expiração(MM)
          </label>
          <div className="mt-1">
            <Input.Root>
              <Input.Control
                type="text"
                id="exp_month"
                placeholder="MM"
                required
                {...register("payments.0.credit_card.card.exp_month")}
              />
            </Input.Root>
          </div>
        </div>

        {/* expiration year */}
        <div className="col-span-4 sm:col-span-4">
          <label
            htmlFor="exp_year"
            className="block text-sm font-base text-gray-700"
          >
            Ano Expiração(AAAA)
          </label>
          <div className="mt-1">
            <Input.Root>
              <Input.Control
                type="text"
                id="exp_year"
                placeholder="AAAA"
                required
                {...register("payments.0.credit_card.card.exp_year")}
              />
            </Input.Root>
          </div>
        </div>

        {/* cvv */}
        <div className="col-span-4 sm:col-span-4">
          <label
            htmlFor="cvv"
            className="block text-sm font-base text-gray-700"
          >
            Código Cartão (CVV)
            {/* {errors.cvv && (
                  <span className="text-sm font-normal text-red-500 dark:text-red-500">
                    {errors.cvv.message}
                  </span>
                )} */}
          </label>
          <div className="mt-1">
            <Input.Root>
              <Input.Control
                id="cvv"
                type="cvv"
                required
                {...register("payments.0.credit_card.card.cvv")}
              />
            </Input.Root>
          </div>
        </div>

        {/* installments */}
        <div className="col-span-full">
          <label
            htmlFor="payment_installments"
            className="block text-sm font-base text-gray-700"
          >
            Parcelas
          </label>
          {/* {errors.payment?.payment_installments && (
            <span className="text-sm font-base text-red-500 dark:text-red-500">
              {errors.payment.payment_installments.message}
            </span>
          )} */}
          <Controller
            name="payment.payment_installments"
            control={control}
            render={({ field }) => (
              <div className="mt-1">
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  defaultValue={"1"}
                >
                  <SelectTrigger className="text-base font-base py-5 px-4">
                    <SelectValue
                      className="text-base font-base"
                      defaultValue={"1"}
                    />
                  </SelectTrigger>
                  <SelectContent id="payment_installments">
                    {installments.map((installment) => (
                      <SelectItem
                        key={installment.value}
                        value={installment.value}
                        className="text-base font-base"
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-medium">
                            {installment.value}x
                          </span>
                          <span className="text-gray-500">
                            de{" "}
                            {formatCurrency(total / Number(installment.value))}
                          </span>
                          <span className="text-gray-500">{`(${
                            installment.interest
                              ? "sem juros"
                              : `${installment.interest} de juros`
                          })`}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>
      </div>

      <div className="mt-6 flex space-x-2 pt-6">
        <div className="flex h-5 items-center">
          <input
            id="same-as-shipping"
            name="same-as-shipping"
            type="checkbox"
            defaultChecked
            className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
          />
        </div>
        <label
          htmlFor="same-as-shipping"
          className="text-sm font-base text-gray-900"
        >
          O endereço de cobrança é o mesmo que o endereço de entrega.
        </label>
      </div>

      <PurchaseButton
        total={total}
        form="create-order-checkout"
        isLoading={isLoading}
      />

      <p className="mt-6 pt-6 flex justify-center text-sm font-base text-gray-500 mb-6">
        <LockIcon className="mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
        Pagamento seguro com criptografia SSL
      </p>
    </form>
  );
}
