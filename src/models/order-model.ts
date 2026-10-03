import mongoose, { Schema, Document, Model } from "mongoose";
import { getCollectionName } from "@/lib/mongodb";

export interface IOrderItemSubdocument {
  product_id: string;
  name: string;
  presentation?: string;
  price: number;
  quantity: number;
  line_total: number;
}

export interface IOrderDocument extends Document {
  order_code: string;
  customer_name?: string;
  customer_note?: string;
  items: IOrderItemSubdocument[];
  total_amount: number;
  status: "whatsapp_opened" | "completed" | "cancelled";
  created_at: Date;
  updated_at: Date;
}

const OrderItemSchema = new Schema<IOrderItemSubdocument>(
  {
    product_id: { type: String, required: true },
    name: { type: String, required: true },
    presentation: { type: String, default: "" },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    line_total: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    order_code: { type: String, required: true, unique: true, index: true },
    customer_name: { type: String, default: "" },
    customer_note: { type: String, default: "" },
    items: [OrderItemSchema],
    total_amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["whatsapp_opened", "completed", "cancelled"],
      default: "whatsapp_opened",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: getCollectionName("orders"),
  }
);

export function getOrderModel(): Model<IOrderDocument> {
  const modelName = `Order_${getCollectionName("orders")}`;
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName] as Model<IOrderDocument>;
  }
  return mongoose.model<IOrderDocument>(modelName, OrderSchema);
}
