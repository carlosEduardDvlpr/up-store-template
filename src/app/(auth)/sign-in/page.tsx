"use client";

import Image from "next/image";
import dznesLogo from "@/../public/logo.svg";
import { SignInForm } from "@/components/Forms/SignIn";
import { Suspense } from "react";
import Link from "next/link";

// Skeleton component for the sign-in form
function SignInFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-28 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>

      <div>
        <div className="h-10 w-full bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFormSkeleton />}>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto h-24 w-auto"
            src={dznesLogo}
            alt="Your Company"
          />
          {/* <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Entrar na sua conta
          </h2> */}
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border border-gray-200 rounded-none p-4 shadow-lg">
          <SignInForm />

          <p className="mt-10 text-center text-sm font-base leading-6 text-gray-500">
            Não é um membro ainda?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-base leading-6 uppercase text-gray-600 hover:text-gray-500"
            >
              Cadastrar
            </Link>
          </p>
        </div>
      </div>
    </Suspense>
  );
}
