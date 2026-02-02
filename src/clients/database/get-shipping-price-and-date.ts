import { http } from "../http";

type ShippingInfo = {
  name: string;
  maxDate: string;
  serviceCode: string;
  price: number;
};

export async function getShippingPriceAndDate(
  shippingCep: string,
  shippingWeight: number,
): Promise<ShippingInfo[] | null> {
  try {
    const data = await http<ShippingInfo[]>("/api/deliveries/price-and-date", {
      method: "POST",
      body: JSON.stringify({
        destinationZipCode: shippingCep,
        weight: shippingWeight.toString(),
        height: "10",
        width: "38",
        length: "30",
        diameter: "0",
      }),
    });
    return data;
  } catch (err) {
    return null;
  }
}
