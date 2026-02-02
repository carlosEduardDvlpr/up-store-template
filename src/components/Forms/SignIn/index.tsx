"use client";

import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useTokenContext } from "@/contexts/token-context";
import Link from "next/link";

const loginFormSchema = zod.object({
  email: zod.string().email({ message: "Email inválido" }),
  password: zod.string().min(6, { message: "Senha inválida" }),
});

type LoginFormData = zod.infer<typeof loginFormSchema>;

export function SignInForm() {
  const { signIn } = useTokenContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(data: LoginFormData) {
    setIsLoading(true);
    try {
      const user = await signIn(data);
      // GTM login event
      if (user) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "login",
          userEmail: data.email, // or any other relevant information
          dzns_id: user?.id,
          role: user?.role,
        });

        // Get the redirect URL from the search params
        const redirectPath = searchParams.get("redirect");

        // If there's a redirect path, navigate to it, otherwise go to home
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          router.push("/");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-6" id="login-form">
      <div>
        <label
          htmlFor="email"
          className="block text-base font-base leading-6 text-gray-900 uppercase"
        >
          E-mail
          {errors.email && (
            <span className="text-xs font-base text-red-500 dark:text-red-500 ml-3">
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
            {...register("email", { required: true })}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-base font-base uppercase leading-6 text-gray-900"
          >
            Senha de acesso
            {errors.password && (
              <span className="text-xs font-base text-red-500 dark:text-red-500 ml-3">
                {`(${errors.password.message})`}
              </span>
            )}
          </label>
          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-semibold text-sm  text-gray-600 hover:text-gray-500"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </div>
        <div className="mt-2">
          <input
            id="password"
            type="password"
            className="block w-full rounded-sm border-0 py-1.5 text-gray-900 px-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
            placeholder="*************"
            {...register("password", { required: true })}
          />
        </div>
      </div>

      <div className="space-y-6">
        <button
          type="submit"
          form="login-form"
          disabled={isLoading}
          className="flex w-full justify-center rounded-sm bg-gray-600 px-3 py-1.5 text-base font-base uppercase leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit(handleLogin)}
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
            "Entrar"
          )}
        </button>
      </div>
    </form>
  );
}
