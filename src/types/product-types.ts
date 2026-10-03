export interface Product {
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
  created_at?: string;
  updated_at?: string;
}

export type ProductCategory =
  | "todos"
  | "yerba-mate"
  | "latas-y-termos"
  | "mates-y-bombillas"
  | "combos"
  | "vinos"
  | "alfajores-y-dulces";

export interface CartItem {
  product: Product;
  quantity: number;
}
