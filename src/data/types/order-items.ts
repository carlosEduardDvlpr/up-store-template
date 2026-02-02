import { Order } from "./orders";

export interface OrderItem {
  id: number;
  product_code: string;
  product_name: string;
  product_reference_code: string;
  product_reference_name: string;
  product_sku_code: string;
  color_code: string;
  color_name: string;
  background_color?: string | null;
  product_image_url?: string | null;
  size_name: string;
  created_at: Date;
  updated_at?: Date;
  quantity: number;
  to_settle_quantity: number;
  settled_quantity: number;
  canceled_quantity: number;
  extra_quantity?: number;
  pending_quantity?: number;
  original_price?: number;
  price: number;
  discount_percentage?: number;
  order_id: string;
  order_code: string;
  order: Order;
}
