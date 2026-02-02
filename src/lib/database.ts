"use server";

import { env } from "@/env";
import { Order } from "@/data/types/orders";
import { Product } from "@/data/types/product";
import { cookies } from "next/headers";
import { REFRESH_TOKEN } from "@/data/constants";
import { Classification } from "@/data/types/classifications";

import { CheckoutBody } from "@/data/types/checkout";
import { NewBoletoOrderFormData } from "@/components/Forms/Checkout/Boleto";
import { NewPixOrderFormData } from "@/components/Forms/Checkout/Pix";
import { NewCreateUserPhoneFormData } from "@/components/Forms/Phone/phone-form";
import { NewCreateUserAddressFormData } from "@/components/Forms/Address/address-form";
import { revalidateTag } from "next/cache";
import { randomUUID } from "crypto";

const companyId = env.COMPANY_ID;

async function databaseApi(path: string, init?: RequestInit) {
  const baseUrl = env.DATABASE_URL;
  const apiPrefix = "/api";
  const url = new URL(apiPrefix.concat(path), baseUrl);

  return fetch(url, init);
}

export async function getHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(REFRESH_TOKEN)?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-frontend-key": env.DATABASE_API_SECRET_KEY,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

interface ValidateResetPasswordTokenResponse {
  user_id: string | null;
  message: string;
}

export async function validateResetPasswordToken(
  tokenId: string,
): Promise<ValidateResetPasswordTokenResponse> {
  const headers = await getHeaders();

  try {
    const { user_id, message } = await databaseApi(
      "/customers/password-token",
      {
        method: "POST",
        headers,
        body: JSON.stringify({ token_id: tokenId }),
      },
    ).then((response) => response.json());

    return { user_id, message };
  } catch (error) {
    console.error(error);
    return { user_id: null, message: "Token inválido" };
  }
}

export async function getUser() {
  const headers = await getHeaders();
  if (!headers.Authorization) {
    return {
      user: null,
      message: "Token inválido",
    };
  }

  const { user } = await databaseApi("/me", {
    method: "GET",
    headers,
    next: {
      tags: ["profile"],
    },
  }).then((res) => res.json());
  return user;
}

export async function createPhone(data: NewCreateUserPhoneFormData) {
  const headers = await getHeaders();

  const response = await databaseApi("/phones", {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (response.status !== 201) {
    return { message: "Erro ao cadastrar Telefone", phone: null };
  }
  const returnData = await response.json();
  revalidateTag("profile", "page");
  const { phone, user } = returnData;

  return { phone, user };
}

export async function updateUserPassword(data: {
  id: string;
  password: string;
  token_id: string;
}) {
  const headers = await getHeaders();

  const response = await databaseApi("/customers/update-password", {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (response.status !== 200) {
    const { message } = await response.json();
    return { message, user: null };
  }
  const { user } = await response.json();
  return { message: null, user };
}

export async function requestResetPassword(email: string) {
  const response = await databaseApi("/customers/request-reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (response.status !== 200) {
    const { message } = await response.json();
    return { message, user: null };
  }
  const { user } = await response.json();
  return { message: null, user };
}

export async function createAddress(data: NewCreateUserAddressFormData) {
  const headers = await getHeaders();

  try {
    const response = await databaseApi("/addresses", {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (response.status !== 201) {
      return { message: "Erro ao cadastrar endereço" };
    }
    const { address } = await response.json();
    revalidateTag("profile", "page");
    return { message: null, address };
  } catch (error) {
    return { message: "Erro ao cadastrar endereço" };
  }
}

// PRODUCTS
interface ProductProps {
  product: Product;
}

export async function getProduct(slug: string): Promise<ProductProps> {
  const headers = await getHeaders();
  const response = await databaseApi(`/products/${slug}`, {
    headers,
    next: {
      revalidate: 60 * 5, // 5 minutes
    },
  });

  const product = await response.json();

  return product;
}

export async function getProducts(): Promise<Product[]> {
  const headers = await getHeaders();
  try {
    const { items } = await databaseApi("/products?q=&page=1&perPage=20", {
      headers,
      body: JSON.stringify({ q: "", page: 1, perPage: 20 }),
      next: {
        revalidate: 60 * 60, //  1 hour
      },
    }).then((res) => res.json());
    return items;
  } catch (error) {
    return [];
  }
}

interface ProductsGeneralSearchProps {
  q?: string;
  page?: number;
  perPage?: number;
  colorCodes?: string[];
  sizeCodes?: string[];
  classificationCodes?: string[];
}

interface GetFeaturedProductsResponse {
  items: Product[];
  count: number;
}

export async function productsGeneralSearch({
  q,
  page,
  perPage,
  colorCodes,
  sizeCodes,
  classificationCodes,
}: ProductsGeneralSearchProps): Promise<GetFeaturedProductsResponse> {
  const body = {
    q,
    page,
    perPage,
    colorCodes,
    sizeCodes,
    classificationCodes,
  };
  const headers = await getHeaders();

  try {
    const response = await databaseApi(`/products`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...body, isAvailable: true }),
      next: {
        revalidate: 60 * 60, // 1 hour
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch products");
    }

    const { items, count } = await response.json();

    return { items, count };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { items: [], count: 0 };
  }
}

interface ApiProductsResponse {
  items: Product[];
  count: number;
  totalPages: number;
}

export async function getProductsFromCategory(
  slug: string,
  q?: string,
  page?: number,
  perPage?: number,
  colorCodes?: string[],
  sizeCodes?: string[],
  classificationCodes?: string[],
): Promise<ApiProductsResponse> {
  const headers = await getHeaders();

  try {
    const body = {
      q,
      page: page ?? 1,
      perPage: perPage ?? 20,
      colorCodes,
      sizeCodes,
      classificationCodes,
    };

    // const { products, count, totalPages }
    const response = await databaseApi(`/products/categories/${slug}`, {
      headers,
      method: "POST",
      body: JSON.stringify(body),
      next: {
        revalidate: 60 * 60, // 1 hour
      },
    });
    const data = await response.json();
    return data;
    // ).then((res) => res.json());

    // return { products, count, totalPages };
  } catch (error) {
    console.error(error);
    return { items: [], count: 0, totalPages: 0 };
  }
}

// interface ProductsFromClassification {
//   products: Product[]
//   count: number
//   totalPages: number
// }

export async function getProductsFromClassification({
  classificationSlug,
  q,
  page,
  perPage,
  colorCodes,
  sizeCodes,
  classificationCodes,
}: {
  classificationSlug: string;
  q?: string;
  page?: number;
  perPage?: number;
  colorCodes?: string[];
  sizeCodes?: string[];
  classificationCodes?: string[];
}): Promise<GetFeaturedProductsResponse> {
  const headers = await getHeaders();
  const body = {
    q,
    page: page ?? 1,
    perPage: perPage ?? 20,
    colorCodes,
    sizeCodes,
    classificationCodes,
  };
  try {
    const response = await databaseApi(
      `/products/classifications/${classificationSlug}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        next: {
          revalidate: 60 * 60, // 1 hour
        },
      },
    );

    if (!response.ok)
      throw new Error("Failed to fetch classification products");

    const { items, count } = await response.json();

    return { items, count };
  } catch (error) {
    return { items: [], count: 0 };
  }
}

interface ApiClassificationsResponse {
  classifications: {
    pages: {
      title: string;
      href: string;
    }[];
  };
}

export async function listClassificationsByTypeCode(
  classificationTypeCode: string,
): Promise<ApiClassificationsResponse> {
  const headers = await getHeaders();

  try {
    const { classifications } = await databaseApi(
      "/classifications/type-code",
      {
        method: "POST",
        headers,
        body: JSON.stringify({ classificationTypeCode }),
        next: {
          revalidate: 60 * 60 * 8, // 8 hours
        },
      },
    ).then((res) => res.json());
    const formatedClassifications = {
      pages: classifications
        .slice(0, 10)
        .map((classification: Classification) => ({
          title: classification.title,
          href: `/classifications/${classification.slug}`,
        })),
    };

    return { classifications: formatedClassifications }; // Limit to first 10 classifications
  } catch (error) {
    return {
      classifications: {
        pages: [],
      },
    };
  }
}

interface GetFeaturedProductsRequest {
  q: string;
  page: number;
  perPage: number;
}

export async function getFeaturedProducts({
  q,
  page,
  perPage,
}: GetFeaturedProductsRequest): Promise<GetFeaturedProductsResponse> {
  const headers = await getHeaders();

  try {
    const response = await databaseApi(`/products`, {
      headers,
      body: JSON.stringify({
        q,
        page,
        perPage,
      }),
      next: {
        revalidate: 60 * 60 * 8, // 8 hours
      },
    });

    const { items, count } = await response.json();

    return { items, count };
  } catch (error) {
    return { items: [], count: 0 };
  }
}

export async function getRecommendedProducts(
  productId: string,
  topK: number,
): Promise<Product[]> {
  const headers = await getHeaders();

  try {
    const response = await databaseApi(`/products/recommend/id`, {
      method: "POST",
      headers,
      body: JSON.stringify({ productId, topK }),
      next: {
        revalidate: 60 * 60 * 8, // 8 hours
      },
    });

    const products = await response.json();

    return products;
  } catch (error) {
    throw new Error("Failed to fetch recommended products");
  }
}

export async function getColors() {
  const headers = await getHeaders();

  const { items } = await databaseApi("/colors/all", {
    method: "GET",
    headers,
    next: {
      revalidate: 60 * 60 * 8, // 8 hours
    },
  }).then((res) => res.json());

  return items;
}

export async function colorsListWithAvailableProducts() {
  const headers = await getHeaders();

  try {
    const response = await databaseApi("/products/colors", {
      method: "GET",
      headers,
      next: { revalidate: 60 * 60 * 8 },
    });
    const { items } = await response.json();
    return items;
  } catch (error) {
    console.error("Failed to list colors with available products:", error);
    return {
      colors: [],
      message: "Erro ao listar cores com produtos disponíveis",
    };
  }
}

export async function getSizes() {
  const headers = await getHeaders();

  const { items } = await databaseApi("/sizes/list", {
    method: "GET",
    headers,
    next: {
      revalidate: 60 * 60 * 8, // 8 hours
    },
  }).then((res) => res.json());

  return items;
}

export async function sizesListWithAvailableProducts() {
  const headers = await getHeaders();

  try {
    const response = await databaseApi("/products/sizes", {
      method: "GET",
      headers,
      next: { revalidate: 60 * 60 * 8 },
    });
    const { items } = await response.json();
    return items;
  } catch (error) {
    console.error("Failed to list colors with available products:", error);
    return {
      colors: [],
      message: "Erro ao listar cores com produtos disponíveis",
    };
  }
}

// CART
export async function addToCart(cartId: string, skuId: number) {
  const headers = await getHeaders();

  try {
    const response = await databaseApi("/carts/add-to-cart", {
      method: "POST",
      headers,
      body: JSON.stringify({
        cart_id: cartId,
        sku_id: skuId,
      }),
    });

    if (response.status === 400) {
      return { message: "Estoque insuficiente.", cart: null };
    }

    if (response.status === 404) {
      return { message: "Carrinho não encontrado.", cart: null };
    }

    const { cart } = await response.json();
    revalidateTag("cart", "page");
    return { message: null, cart };
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return { message: JSON.stringify(error), cart: null };
  }
}

export async function decreaseCartItem(cartId: string, skuId: number) {
  const headers = await getHeaders();

  try {
    const response = await databaseApi("/carts/decrease-cart-item", {
      method: "POST",
      headers,
      body: JSON.stringify({
        cart_id: cartId,
        sku_id: skuId,
      }),
    });

    if (response.status === 400) {
      return { message: "Estoque insuficiente.", cart: null };
    }

    if (response.status === 404) {
      return { message: "Carrinho não encontrado.", cart: null };
    }

    const { cart } = await response.json();
    revalidateTag("cart", "page");
    return { message: null, cart };
  } catch (error) {
    console.error("Failed to decrease cart item:", error);
    return { message: JSON.stringify(error), cart: null };
  }
}

// CORREIOS - SHIPPING
export async function getShippingPrice(
  shippingCep: string,
  shippingWeight: number,
) {
  const headers = await getHeaders();

  const response = await databaseApi("/deliveries/price-and-date", {
    method: "POST",
    headers,
    body: JSON.stringify({
      destinationZipCode: shippingCep,
      weight: shippingWeight.toString(),
      height: "10",
      width: "38",
      length: "30",
      diameter: "0",
    }),
  });

  const data = await response.json();
  return data;
}

export async function getAddressDataByCep(cep: string) {
  const headers = await getHeaders();
  const response = await databaseApi("/deliveries/address-by-zipcode", {
    method: "POST",
    headers,
    body: JSON.stringify({ cep, company_id: companyId }),
  });

  if (!response.ok) {
    return { message: "CEP Inválido, tente novamente" };
  }

  const { uf, localidade, logradouro, bairro } = await response.json();
  return { uf, localidade, logradouro, bairro };
}

// ORDERS
interface GetOrderResponse {
  order: Order;
}

export async function getOrder(id: string): Promise<GetOrderResponse> {
  const headers = await getHeaders();

  const response = await databaseApi(`/orders/${id}`, {
    headers,
    next: {
      revalidate: 60 * 1, // 1 minute
    },
  });

  const order = await response.json();

  return order;
}

export async function getOrders(): Promise<Order[] | null> {
  const headers = await getHeaders();

  try {
    const response = await databaseApi(`/customers/orders`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    const { items } = await response.json();

    return items;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return null; // or you can throw the error depending on your needs
  }
}

// CHECKOUT
interface CardInfo {
  type: string;
  email?: string;
  card: {
    number?: string;
    holder_name?: string;
    exp_month?: number;
    exp_year?: number;
    cvv?: string;
  };
}
export async function getCreditCardToken(cardInfo: CardInfo) {
  const headers = await getHeaders();
  const response = await databaseApi("/checkouts/creadit-card/card-token", {
    method: "POST",
    headers,
    body: JSON.stringify({ ...cardInfo, company_id: companyId }), // data needed to create card token
  });

  const data = await response.json();

  return data;
}

interface CreateOrderResponse {
  orderId: string | null;
  message: string | null;
}

export async function createOrder(
  checkoutBody: CheckoutBody,
): Promise<CreateOrderResponse> {
  const headers = await getHeaders();
  if (!headers.Authorization) {
    return {
      orderId: null,
      message: "Usuário não autenticado",
    };
  }

  const response = await databaseApi("/checkouts/credit-card/authorize", {
    method: "POST",
    headers,
    body: JSON.stringify({
      ...checkoutBody,
      company_id: companyId,
      orderId: randomUUID(),
    }),
  });

  if (response.status !== 201) {
    const data = await response.json();
    const { message } = data;
    return { orderId: null, message };
  }

  const data = await response.json();
  const { id }: { id: string } = data;

  if (id) {
    return { orderId: id, message: null };
  }
  return { orderId: null, message: "Erro ao criar pedido" };
}

export async function createBoletoOrder(
  data: NewBoletoOrderFormData,
): Promise<CreateOrderResponse> {
  const headers = await getHeaders();
  if (!headers.Authorization) {
    return {
      orderId: null,
      message: "Usuário não autenticado",
    };
  }

  const response = await databaseApi("/checkouts/boleto", {
    method: "POST",
    headers,
    body: JSON.stringify({ ...data, company_id: companyId }),
  });

  if (response.status === 409) {
    return {
      orderId: null,
      message: "Conflito ao cadastrar o pedido, tente novamente.",
    };
  }

  if (response.status !== 201) {
    return { orderId: null, message: "Erro ao criar pedido" };
  }

  const { id }: { id: string } = await response.json();

  if (id) {
    return { orderId: id, message: null };
  }
  return { orderId: null, message: "Erro ao criar pedido" };
}

export async function createPixOrder(
  data: NewPixOrderFormData,
): Promise<CreateOrderResponse> {
  const headers = await getHeaders();
  if (!headers.Authorization) {
    return {
      orderId: null,
      message: "Usuário não autenticado",
    };
  }

  const response = await databaseApi("/checkouts/pix", {
    method: "POST",
    headers,
    body: JSON.stringify({ ...data, company_id: companyId }),
  });

  if (response.status === 409) {
    return {
      orderId: null,
      message: "Conflito ao cadastrar o pedido, tente novamente.",
    };
  }

  if (response.status !== 201) {
    return { orderId: null, message: "Erro ao criar pedido" };
  }

  const { id }: { id: string } = await response.json();

  if (id) {
    return { orderId: id, message: null };
  }
  return { orderId: null, message: "Erro ao criar pedido" };
}
