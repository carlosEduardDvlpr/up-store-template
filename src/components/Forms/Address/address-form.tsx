"use client";

import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import * as Input from "@/components/Input";

import { User } from "@/data/types/user";
import { Address } from "@/data/types/addresses";
import { isValidCEP, removeNonNumericalChars } from "@/lib/utils";
import { createAddress } from "@/lib/database";
import { ToastError } from "@/components/Toaster/toast-error";
import { ToastSuccess } from "@/components/Toaster/toast-success";
import { addressInfoViaCEP } from "@/lib/via-cep";

const newCreateUserAddressFormSchema = zod.object({
  userId: zod.string(),
  status: zod.number(),
  type: zod.string().min(1, { message: "Informe o tipo de endereço." }),
  country: zod.string().min(1, { message: "Informe o país." }),
  state: zod.string().min(1, { message: "Informe o estado" }),
  city: zod.string().min(1, { message: "Informe a cidade." }),
  zip_code: zod.string().min(1, { message: "Informe o CEP." }),
  street: zod.string().min(1, { message: "Informe a rua." }),
  number: zod.coerce
    .number()
    .min(1, { message: "Informe a numeração do endereço." }),
  neighborhood: zod.string().min(1, { message: "Informe o bairro." }),
  complement: zod.string().optional(),
});

interface CreateUserAddressProps {
  user: User | null;
  address?: Address;
  setShowForm?: (data: boolean) => void;
}

export type NewCreateUserAddressFormData = zod.infer<
  typeof newCreateUserAddressFormSchema
>;

export function CreateUserAddressForm({
  user,
  address,
  setShowForm,
}: CreateUserAddressProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewCreateUserAddressFormData>({
    resolver: zodResolver(newCreateUserAddressFormSchema),
    defaultValues: {
      userId: user?.id,
      status: 200,
      type: address?.type ?? "Delivery",
      country: address?.country ?? "",
      state: address?.state ?? "",
      city: address?.city ?? "",
      zip_code: address?.zip_code ?? "",
      street: address?.street ?? "",
      number: address?.number ?? 0,
      neighborhood: address?.neighborhood ?? "",
      complement: address?.complement ?? "",
    },
  });

  const zip_code = watch("zip_code");

  useEffect(() => {
    async function fetchAddressData(cep: string) {
      try {
        const data = await addressInfoViaCEP(cep);

        if ("message" in data) {
          ToastError({
            title: "Endereço",
            description: data.message,
          });
          return;
        }
        const { uf, localidade, logradouro, bairro } = data;

        // Update the form fields with the response data
        reset({
          ...watch(),
          street: logradouro,
          neighborhood: bairro,
          city: localidade,
          state: uf,
          country: "Brasil",
        });
      } catch (error) {
        ToastError({
          title: "Endereço",
          description: "Erro ao buscar endereço pelo CEP",
          jsonError: JSON.stringify(error),
        });
      }
    }

    if (zip_code && isValidCEP(zip_code)) {
      fetchAddressData(removeNonNumericalChars(zip_code));
    }
  }, [zip_code, reset, watch]);

  async function handleNewCreateUserAddress(
    data: NewCreateUserAddressFormData,
  ) {
    setIsLoading(true);
    try {
      const response = await createAddress({
        ...data,
        zip_code: removeNonNumericalChars(data.zip_code),
      });
      if (response.message) {
        ToastError({
          title: "Endereço",
          description: response.message,
        });
        return;
      }

      if (response.address) {
        ToastSuccess({
          title: "Cadastro de Endereço",
          description: "Endereço cadastrado com sucesso!",
        });
        if (setShowForm) {
          setShowForm(false);
        }
      }
    } catch (error) {
      ToastError({
        title: "Cadastro de Endereço",
        description: "Erro ao cadastrar endereço",
        jsonError: JSON.stringify(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  const country = watch("country");
  const state = watch("state");
  const city = watch("city");
  const street = watch("street");
  const number = watch("number");
  // const zip_code = watch('zip_code')

  const isSubmitDisable =
    !country || !state || !city || !street || !number || !zip_code;

  return (
    <form
      id="register_user_address"
      onSubmit={handleSubmit(handleNewCreateUserAddress)}
      className="mt-6 flex w-full flex-col gap-5 divide-y divide-zinc-200 dark:divide-zinc-800"
    >
      {/* zip_code */}
      <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
        <label
          htmlFor="zip_code"
          className="flex flex-col text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-100"
        >
          CEP
          {errors.zip_code && (
            <span className="text-sm font-normal text-red-500 dark:text-red-500">
              {errors.zip_code.message}
            </span>
          )}
        </label>
        <div className="flex gap-3">
          <Input.Root>
            <Input.Control
              id="zip_code"
              type="zip_code"
              placeholder="Exemplo: 01149-130"
              required
              {...register("zip_code")}
            />
          </Input.Root>
        </div>
      </div>

      {/* street and number */}
      <div className="grid gap-3 pt-5 lg:grid-cols-form">
        <label
          htmlFor="cellphone"
          className="flex flex-col text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-100"
        >
          Endereço
          {errors.street && (
            <span className="text-sm font-normal text-red-500 dark:text-red-500">
              {errors.street.message}
            </span>
          )}
          {errors.number && (
            <span className="text-sm font-normal text-red-500 dark:text-red-500">
              {errors.number.message}
            </span>
          )}
        </label>
        <div className="grid grid-cols-10 gap-6">
          <Input.Root className="col-span-8">
            <Input.Control
              id="street"
              type="string"
              placeholder="Nome da rua"
              required
              {...register("street")}
            />
          </Input.Root>
          <Input.Root className="col-span-2">
            <Input.Control
              id="number"
              type="number"
              placeholder="Número"
              required
              {...register("number")}
            />
          </Input.Root>
        </div>
      </div>

      {/* complements */}
      <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
        <label
          htmlFor="complement"
          className="flex flex-col text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-100"
        >
          Complementos
          {errors.complement && (
            <span className="text-sm font-normal text-red-500 dark:text-red-500">
              {errors.complement.message}
            </span>
          )}
        </label>
        <div className="grid grid-cols gap-6">
          <Input.Root>
            <Input.Control
              id="complement"
              type="complement"
              placeholder="Exemplo: Apartamento 1405"
              {...register("complement")}
            />
          </Input.Root>
        </div>
      </div>

      {/* neighborhood */}
      <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
        <label
          htmlFor="neighborhood"
          className="flex flex-col text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-100"
        >
          Bairro
          {errors.neighborhood && (
            <span className="text-sm font-normal text-red-500 dark:text-red-500">
              {errors.neighborhood.message}
            </span>
          )}
        </label>
        <div className="flex gap-3">
          <Input.Root>
            <Input.Control
              id="neighborhood"
              type="neighborhood"
              placeholder="Exemplo: Vila Mariana"
              {...register("neighborhood")}
            />
          </Input.Root>
        </div>
      </div>

      {/* country */}
      <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
        <label
          htmlFor="country"
          className="flex flex-col text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-100"
        >
          País
          {errors.country && (
            <span className="text-sm font-normal text-red-500 dark:text-red-500">
              {errors.country.message}
            </span>
          )}
        </label>
        <div className="flex gap-3">
          <Input.Root>
            <Input.Control
              id="country"
              type="country"
              placeholder="Exemplo: Brasil"
              {...register("country")}
            />
          </Input.Root>
        </div>
      </div>

      {/* city and state */}
      <div className="grid gap-3 pt-5 lg:grid-cols-form">
        <label
          htmlFor="first_name"
          className="flex flex-col text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-100"
        >
          Cidade e Estado
          {errors.city && (
            <span className="text-sm font-normal text-red-500 dark:text-red-500">
              {errors.city.message}
            </span>
          )}
        </label>

        <div className="grid grid-cols-2 gap-6">
          <Input.Root>
            <Input.Control
              id="city"
              type="string"
              placeholder="Cidade"
              required
              {...register("city")}
            />
          </Input.Root>
          <Input.Root>
            <Input.Control
              id="state"
              type="string"
              placeholder="Estado"
              required
              {...register("state")}
            />
          </Input.Root>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-5">
        <button
          type="button"
          onClick={() => {
            if (setShowForm) {
              setShowForm(false);
            }
          }}
          className="rounded-none border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          form="register_user_address"
          disabled={isSubmitDisable || isLoading}
          className="rounded-none bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Carregando
            </>
          ) : (
            "Cadastrar"
          )}
        </button>
      </div>
    </form>
  );
}
