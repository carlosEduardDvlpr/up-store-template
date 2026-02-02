// src/app/api/cart/database/route.ts

import { cookies } from "next/headers";
import { REFRESH_TOKEN } from "@/data/constants";
import { databaseApi } from "@/data/database-api";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { revalidateTag } from "next/cache";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(REFRESH_TOKEN);

  const response = await databaseApi("/carts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token?.value ? `Bearer ${token?.value}` : "",
      "x-api-frontend-key": env.DATABASE_API_SECRET_KEY,
    },
    next: {
      tags: ["cart"],
    },
  });

  if (response.status === 200) {
    const cart = await response.json();
    const items = cart.cart_items || [];
    return NextResponse.json({ cart: { id: cart.id, items } }, { status: 200 }); // ✅ Correto
  }

  return NextResponse.json(null, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { cart } = await request.json();
  const cookieStore = await cookies();
  // if (!cart.id) {
  //   cart.id = uuidv4()
  // }

  const token = cookieStore.get(REFRESH_TOKEN);
  // if (!token?.value) {
  //   return new Response('Usuário não autenticado', { status: 401 })
  // }
  const response = await databaseApi("/carts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token?.value ? `Bearer ${token?.value}` : "",
      "x-api-frontend-key": env.DATABASE_API_SECRET_KEY,
    },
    body: JSON.stringify({ cart }), // ✅ Corrigido
  });

  if (response.status === 200) {
    revalidateTag("cart", "layer");
    return NextResponse.json(
      JSON.stringify({ message: `Cart updated in database` }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  return NextResponse.json(
    { message: "Unknown UPSERT CART error" },
    { status: 500 },
  );
}
