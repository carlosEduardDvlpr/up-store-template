"use server";

import { cookies } from "next/headers";
import { REFRESH_TOKEN } from "@/data/constants";
import { env } from "@/env";

type HttpError = {
  status: number;
  body: unknown;
};

async function getBody<T>(res: Response): Promise<T> {
  // 204 No Content
  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }

  // fallback: text
  return (await res.text()) as unknown as T;
}

function buildHeaders(extra?: HeadersInit): Headers {
  const h = new Headers(extra);
  h.set("x-api-frontend-key", env.DATABASE_API_SECRET_KEY);
  if (!h.has("Content-Type")) h.set("Content-Type", "application/json");
  return h;
}

async function buildHeadersWithAuth(extra?: HeadersInit): Promise<Headers> {
  const h = buildHeaders(extra);

  const cookieStore = await cookies(); // Next 15/16: async
  const token = cookieStore.get(REFRESH_TOKEN)?.value;

  if (token && !h.has("Authorization")) {
    h.set("Authorization", `Bearer ${token}`);
  }

  return h;
}

export async function http<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = new URL(path, env.DATABASE_URL);

  const headers =
    options.credentials === "omit"
      ? buildHeaders(options.headers) // só formata Content-Type
      : await buildHeadersWithAuth(options.headers); // pega cookie + seta Bearer

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.ok) {
    return await getBody<T>(res);
  }

  const errorBody = await getBody<unknown>(res);
  return Promise.reject({
    status: res.status,
    body: errorBody,
  } satisfies HttpError);
}
