import { REFRESH_TOKEN } from "@/data/constants";
import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  console.log("Incoming request:", request.nextUrl.pathname);
  const token = request.cookies.get(REFRESH_TOKEN);

  const signInURL = new URL("/sign-in", request.url);
  const homeURL = new URL("/", request.url);

  if (!token?.value) {
    if (
      request.nextUrl.pathname === "/sign-in" ||
      request.nextUrl.pathname === "/sign-up"
    ) {
      return NextResponse.next();
    }

    // Store the current URL as the redirect destination
    const currentPath = request.nextUrl.pathname + request.nextUrl.search;
    signInURL.searchParams.set("redirect", currentPath);

    return NextResponse.redirect(signInURL);
  }
  if (request.nextUrl.pathname === "/sign-in") {
    return NextResponse.redirect(homeURL);
  }
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/admin/:path*",
    "/checkout/:path*",
    "/account/:path*",
  ],
};
