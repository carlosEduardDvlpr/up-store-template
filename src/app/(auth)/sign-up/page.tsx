import Image from "next/image";

import logo from "@/../public/logo.svg";
import { SignUpForm } from "@/components/Forms/SignUp";
import { Suspense } from "react";

export default function SignUp() {
  return (
    <div className="flex min-h-full w-full flex-col justify-center px-3">
      <Suspense>
        <SignUpForm />
      </Suspense>
    </div>
  );
}
