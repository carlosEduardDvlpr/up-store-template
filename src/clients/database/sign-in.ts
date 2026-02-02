"use server";

import jwt from "jsonwebtoken";
import { http } from "../http";

export type User = {
  id: string;
  role: string;
  token: string;
  expiry_date: Date;
  maxAge: number;
};

export async function signInUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User | null> {
  try {
    const { token } = await http<{ token: string }>("/api/sessions", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const decodedToken = jwt.decode(token);
    if (
      decodedToken &&
      decodedToken.sub &&
      typeof decodedToken === "object" &&
      "role" in decodedToken
    ) {
      const maxAge =
        decodedToken.iat && decodedToken.exp
          ? decodedToken.exp - decodedToken.iat
          : 60 * 60 * 24 * 7;

      const expiry_date = new Date(Date.now() + maxAge * 1000);

      const user = {
        id: decodedToken.sub,
        role: decodedToken.role,
        token,
        maxAge: maxAge,
        expiry_date,
      };

      return user;
    }
    return null;
  } catch (err) {
    console.error("[signInUser]", JSON.stringify(err));
    return null;
  }
}
