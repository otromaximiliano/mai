import { CatalogView } from "@/components/catalog-view";
import { connectToDatabase } from "@/lib/mongodb";
import { getProductModel } from "@/models/product-model";
import initialProductsData from "@/data/initial-products.json";
import { Product } from "@/types/product-types";

export const dynamic = "force-dynamic";

async function getCatalogProducts(): Promise<Product[]> {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const ProductModel = getProductModel();
      const docs = await ProductModel.find({}).sort({ featured: -1, name: 1 }).lean();
      if (docs && docs.length > 0) {
        return docs.map((d) => ({
          id: d.id,
          name: d.name,
          category: d.category,
          brand: d.brand || "",
          presentation: d.presentation || "",
          price: d.price,
          stock: d.stock !== false,
          featured: Boolean(d.featured),
          image_filename: d.image_filename || "",
          description: d.description || "",
        }));
      }
    }
  } catch (error) {
    console.error("Error fetching products from MongoDB in page.tsx, using fallback:", error);
  }

  return initialProductsData as Product[];
}

export default async function HomePage() {
  const products = await getCatalogProducts();

  return <CatalogView initialProducts={products} />;
}
