import CheckoutSection from "@/components/Checkout/CheckoutSection";
import { getUser } from "@/lib/database";
import Link from "next/link";
import { Suspense } from "react";

export default async function CheckoutPage() {
  const user = await getUser();
  if (user) {
    return (
      <Suspense>
        <main className="lg:flex lg:min-h-full lg:flex-row-reverse lg:overflow-hidden">
          <CheckoutSection user={user} />
        </main>
      </Suspense>
    );
  } else {
    return (
      <div className="flex min-h-[100vh] max-w-[100vw] flex-col items-center justify-center space-y-4 px-4 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight uppercase">
            Usuário não identificado
          </h1>
          <p className="text-sm text-muted-foreground">
            Faça login para acessar esta página e continuar com sua compra.
          </p>
        </div>
        <Link
          href="/sign-in"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-base text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Fazer Login
        </Link>
      </div>
    );
  }
}
