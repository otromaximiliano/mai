import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getProductModel } from "@/models/product-model";
import initialProductsData from "@/data/initial-products.json";
import { slugify } from "@/utils/slugify";
import { Product } from "@/types/product-types";

function getFallbackProducts(): Product[] {
  return initialProductsData as Product[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const conn = await connectToDatabase();

    let products: Product[] = [];

    if (conn) {
      const ProductModel = getProductModel();
      const filter: Record<string, unknown> = {};

      if (category && category !== "todos") {
        filter.category = category;
      }

      if (search && search.trim().length > 0) {
        const regex = new RegExp(search.trim(), "i");
        filter.$or = [{ name: regex }, { brand: regex }, { description: regex }];
      }

      const docs = await ProductModel.find(filter).sort({ featured: -1, name: 1 }).lean();
      products = docs.map((d) => ({
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
    } else {
      let filtered = getFallbackProducts();
      if (category && category !== "todos") {
        filtered = filtered.filter((p) => p.category === category);
      }
      if (search && search.trim().length > 0) {
        const term = search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.brand.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term)
        );
      }
      products = filtered;
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error in GET /api/products:", error);
    // Fallback on error to ensure store continuity
    return NextResponse.json({
      success: true,
      count: initialProductsData.length,
      data: initialProductsData,
      is_fallback: true,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, brand, presentation, price, stock, featured, image_filename, description } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { success: false, error: "El nombre y el precio son obligatorios." },
        { status: 400 }
      );
    }

    const id = body.id || slugify(`${name}-${presentation || ""}-${Date.now().toString().slice(-4)}`);
    const newProduct: Product = {
      id,
      name: name.trim(),
      category: category || "yerba-mate",
      brand: brand || "",
      presentation: presentation || "",
      price: Number(price),
      stock: stock !== false,
      featured: Boolean(featured),
      image_filename: image_filename || "",
      description: description || "",
    };

    const conn = await connectToDatabase();
    if (conn) {
      const ProductModel = getProductModel();
      await ProductModel.create(newProduct);
    }

    return NextResponse.json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    console.error("Error in POST /api/products:", error);
    return NextResponse.json(
      { success: false, error: "No se pudo guardar el producto." },
      { status: 500 }
    );
  }
}
