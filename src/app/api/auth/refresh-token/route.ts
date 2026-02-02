import { databaseApi } from "@/data/database-api";
import { REFRESH_TOKEN } from "@/data/constants";
import { serialize } from "cookie";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { env } from "@/env";

export async function PATCH() {
  const cookieStore = await cookies();
  const currentToken = cookieStore.get("dzns.ecommerce.user");

  // If the token is missing, return a silent error without logging
  if (!currentToken || !currentToken.value) {
    return NextResponse.json(
      { message: "Credenciais inválidas." },
      {
        status: 401,
      },
    );
  }

  try {
    const response = await databaseApi("/sessions/refresh", {
      method: "PATCH",
      headers: {
        "x-api-frontend-key": env.DATABASE_API_SECRET_KEY,
        Cookie: `refreshToken=${currentToken.value}; HttpOnly; SameSite=Strict;`,
      },
      next: {
        revalidate: 60 * 30, // 30 minutes
      },
    });


    const data = await response.json();
    const token = data.token;

    // Decode the token
    const decodedToken = jwt.decode(token);

    // Check if the decoded token is an object and if it has a role property
    if (
      decodedToken &&
      typeof decodedToken === "object" &&
      "role" in decodedToken
    ) {
      // Calculate maxAge (in seconds)
      const maxAge =
        decodedToken.iat && decodedToken.exp
          ? decodedToken.exp - decodedToken.iat
          : 60 * 60 * 24 * 7; // Default to 7 days if values are missing

      // Set expiry_date (convert maxAge to milliseconds)
      const expiry_date = new Date(Date.now() + maxAge * 1000);

      const user = {
        id: decodedToken.sub,
        role: decodedToken.role,
        maxAge,
        expiry_date,
      };

      const serialized = serialize(REFRESH_TOKEN, token, {
        httpOnly: true,
        maxAge, // Cookie expiration time in seconds
      });


      return NextResponse.json(JSON.stringify(user), {
        status: 200,
        headers: { "Set-Cookie": serialized },
      });
    }

    return Response.json({ message: "Token inválido." }, { status: 401 });
  } catch (error: unknown) {
    // Handle any errors that occur during the API call without logging to the console
    return Response.json(
      {
        message:
          "Erro ao tentar atualizar o token. Tente novamente mais tarde.",
      },
      {
        status: 500,
      },
    );
  }
}
