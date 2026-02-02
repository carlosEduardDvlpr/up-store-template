"use client";

import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import * as Input from "@/components/Input";
import { Telephone } from "@/data/types/telephone";
import { User } from "@/data/types/user";
import { createPhone } from "@/lib/database";
import { ToastError } from "@/components/Toaster/toast-error";
import { ToastSuccess } from "@/components/Toaster/toast-success";

const newCreateUserPhoneFormSchema = zod.object({
  status: zod.number(),
  type: zod.string(),
  ddd_code: zod
    .string()
    .min(2, { message: "Mínimo de 2 caracteres" })
    .max(3, { message: "Máximo de 3 caracteres" }),
  number: zod
    .string()
    .min(8, { message: "Mínimo de 8 caracteres" })
    .max(9, { message: "Máximo de  caracteres" }),
});

export type NewCreateUserPhoneFormData = zod.infer<
  typeof newCreateUserPhoneFormSchema
>;

interface CreateUserPhoneProps {
  user: User | null;
  telephone?: Telephone;
  setShowForm?: (data: boolean) => void;
}

export function CreateUserPhoneForm({
  user,
  telephone,
  setShowForm,
}: CreateUserPhoneProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewCreateUserPhoneFormData>({
    resolver: zodResolver(newCreateUserPhoneFormSchema),
    defaultValues: {
      status: 200,
      type: "COMERCIAL",
      ddd_code: telephone?.ddd_code ?? "",
      number: telephone?.number ?? "",
    },
  });

  async function handleNewCreateUserPhone(data: NewCreateUserPhoneFormData) {
    if (!user || !user.id) {
      ToastError({
        title: "Autenticação do usuário",
        description: "Usuário não autenticado.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await createPhone(data);
      event?.preventDefault();

      if (response.message) {
        ToastError({
          title: "Cadastro de telefone",
          description: response.message,
        });
      }

      ToastSuccess({
        title: "Cadastro de telefone",
        description: "Cadastro realizado com sucesso!",
      });
      if (setShowForm) {
        setShowForm(false);
      }
      reset();
    } finally {
      setIsLoading(false);
    }
  }

  const number = watch("number");
  const ddd_code = watch("ddd_code");

  const isSubmitDisable = !number || !ddd_code;

  return (
    <form
      id="register_user_telephone"
      onSubmit={handleSubmit(handleNewCreateUserPhone)}
      className="mt-6 flex w-full flex-col gap-5 divide-y divide-zinc-200 dark:divide-zinc-800"
    >
      {/* cellphone */}
      <div className="grid gap-3 pt-5 lg:grid-cols-form">
        <label
          htmlFor="cellphone"
          className="flex flex-col text-sm font-base leading-relaxed text-zinc-700 dark:text-zinc-100"
        >
          Número do celular
          {errors.number && (
            <span className="text-sm font-base text-red-500 dark:text-red-500">
              {errors.number.message}
            </span>
          )}
          {errors.ddd_code && (
            <span className="text-sm font-base text-red-500 dark:text-red-500">
              {errors.ddd_code.message}
            </span>
          )}
        </label>

        <div className="grid grid-cols-10 gap-6">
          <Input.Root className="col-span-2">
            <Input.Control
              id="dddCellphone"
              type="string"
              placeholder="DDD"
              required
              {...register("ddd_code")}
            />
          </Input.Root>
          <Input.Root className="col-span-8">
            <Input.Control
              id="cellphone"
              type="string"
              placeholder="Número de celular"
              required
              {...register("number")}
            />
          </Input.Root>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-5">
        <button
          type="button"
          onClick={() => {
            if (setShowForm) {
              reset();
              setShowForm(false);
            }
          }}
          className="rounded-none border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          form="register_user_telephone"
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
