import mongoose, { Schema, Document, Model } from "mongoose";
import { getCollectionName } from "@/lib/mongodb";

export interface IProductDocument extends Document {
  id: string;
  name: string;
  category: string;
  brand: string;
  presentation: string;
  price: number;
  stock: boolean;
  featured: boolean;
  image_filename: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true, index: true },
    brand: { type: String, default: "" },
    presentation: { type: String, default: "" },
    price: { type: Number, required: true },
    stock: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false },
    image_filename: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: getCollectionName("products"),
  }
);

export function getProductModel(): Model<IProductDocument> {
  const modelName = `Product_${getCollectionName("products")}`;
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName] as Model<IProductDocument>;
  }
  return mongoose.model<IProductDocument>(modelName, ProductSchema);
}
