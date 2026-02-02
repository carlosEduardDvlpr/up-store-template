// app/api/signout/route.ts (assuming you're using the App Router structure)

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { REFRESH_TOKEN } from "@/data/constants";

export async function POST() {
  // Get the cookie store
  const cookieStore = await cookies();

  // Remove cookies by setting empty value and immediate expiration
  cookieStore.set(REFRESH_TOKEN, "", {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 0, // Expire immediately
  });

  cookieStore.set("dznes_cart", "", {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 0, // Expire immediately
  });

  return NextResponse.json(
    { message: "Signed out successfully." },
    { status: 200 },
  );
}
