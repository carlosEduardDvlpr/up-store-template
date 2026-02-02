import React, { Suspense } from "react";

import { Header } from "@/components/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen w-full overflow-x-hidden bg-white">
      <Suspense>
        <Header />
      </Suspense>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm md:max-w-[70vw] lg:max-w-[50vw] pt-16">
        {children}
      </div>
    </div>
  );
}
