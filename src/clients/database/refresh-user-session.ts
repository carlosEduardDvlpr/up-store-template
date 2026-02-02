"use server";

import { http } from "../http";
import jwt from "jsonwebtoken";

export type SessionUser = {
  id: string;
  role: string;
  token: string;
  maxAge: number;
};

export async function refreshSessionToken(): Promise<SessionUser | null> {
  try {
    const { token } = await http<{ token: string }>("/api/sessions", {
      method: "PATCH",
      body: JSON.stringify({}),
    });
    const decodedToken = jwt.decode(token);

    // Check if the decoded token is an object and if it has a role property
    if (
      decodedToken &&
      decodedToken.sub &&
      typeof decodedToken === "object" &&
      "role" in decodedToken
    ) {
      // Calculate maxAge (in seconds)
      const maxAge =
        decodedToken.iat && decodedToken.exp
          ? decodedToken.exp - decodedToken.iat
          : 60 * 60 * 24 * 7; // Default to 7 days if values are missing

      const user = {
        id: decodedToken.sub,
        role: decodedToken.role,
        token: token,
        maxAge,
      };
      return user;
    }
    return null;
  } catch (err) {
    console.error('[refreshSessionToken]', JSON.stringify(err))
    return null;
  }
}

