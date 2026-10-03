export interface OrderItemDetail {
  product_id: string;
  name: string;
  presentation?: string;
  price: number;
  quantity: number;
  line_total: number;
}

export interface OrderRecord {
  order_code: string;
  customer_name?: string;
  customer_note?: string;
  items: OrderItemDetail[];
  total_amount: number;
  status: "whatsapp_opened" | "completed" | "cancelled";
  created_at: string;
}
