import Image from "next/image";
import dznesLogo from "@/../public/logo.svg";
import { ForgotPasswordForm } from "@/components/Forms/ForgotPassword";
import { Suspense } from "react";

export default async function ForgotPasswordPage() {
  return (
    <Suspense>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto h-24 w-auto"
            src={dznesLogo}
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Recuperação de senha
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border border-gray-200 rounded-none p-4 shadow-lg">
          <ForgotPasswordForm />

          <p className="mt-2 text-center text-sm text-gray-500">
            Enviar link para recuperação de senha.
          </p>
        </div>
      </div>
    </Suspense>
  );
}
