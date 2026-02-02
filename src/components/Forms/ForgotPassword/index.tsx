"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { requestResetPassword } from "@/lib/database";
import { ToastError } from "@/components/Toaster/toast-error";
import { ToastSuccess } from "@/components/Toaster/toast-success";

const requestResetPasswordFormSchema = z.object({
  email: z.email({ message: "Email inválido" }),
});

type RequestResetPasswordFormData = z.infer<
  typeof requestResetPasswordFormSchema
>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestResetPasswordFormData>({
    resolver: zodResolver(requestResetPasswordFormSchema),
    defaultValues: { email: "" },
  });

  async function handleRequestResetPassword(
    data: RequestResetPasswordFormData,
  ) {
    setIsLoading(true);
    try {
      const { message, user } = await requestResetPassword(data.email);

      if (message) {
        ToastError({
          title: "Redefinição de senha",
          description: message,
        });
        return;
      }

      ToastSuccess({
        title: "Redefinição de senha",
        description: "E-mail de redefinição de senha enviado com sucesso",
      });

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "forgot-password",
        userEmail: data.email,
        user_id: user.id,
        role: user.role,
      });

      reset();
    } catch (error) {
      ToastError({
        title: "Redefinição de senha",
        description: "Erro ao solicitar redefinição de senha",
        jsonError: JSON.stringify(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      className="space-y-6"
      id="request-reset-password-form"
      onSubmit={handleSubmit(handleRequestResetPassword)}
    >
      <div>
        <label
          htmlFor="email"
          className="block text-base font-base uppercase leading-6 text-gray-900"
        >
          E-mail
          {errors.email && (
            <span className="text-sm font-base text-red-500 dark:text-red-500 ml-3">
              {`(${errors.email.message})`}
            </span>
          )}
        </label>

        <div className="mt-2">
          <input
            id="email"
            type="email"
            placeholder="usuario@site.com.br"
            className="block w-full rounded-sm border-0 py-1.5 text-gray-900 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
            {...register("email")}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-sm bg-gray-600 px-3 py-1.5 text-base font-base uppercase leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:opacity-50"
        >
          {isLoading ? "Processando..." : "Enviar"}
        </button>
      </div>
    </form>
  );
}
