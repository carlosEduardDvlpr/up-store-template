"use server";

import { http } from "../http";

type RegisterWholesaleOrderRequest = {
  customer_id: string;
  cart_id: string;
  address_id: string;
  phone_id: string;
  origin?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  };
  shipping?: {
    address_id: string;
    phone_id: string;
    service_code: string;
    pickup_date?: string;
  };
};

export async function registerWholesaleOrder(
  data: RegisterWholesaleOrderRequest,
) {
  try {
    const response = await http<{ id: string }>(
      "/api/checkouts/wholesale/register",
      {
        method: "POST",
        body: JSON.stringify({
          ...data,
        }),
      },
    );
    return {
      id: response.id,
    };
  } catch (err) {
    console.error("[registerWholesaleOrder]", err);
    return null;
  }
}
