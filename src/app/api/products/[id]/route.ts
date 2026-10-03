import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getProductModel } from "@/models/product-model";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { success: false, error: "Base de datos MongoDB no conectada en .env.local" },
        { status: 503 }
      );
    }

    const ProductModel = getProductModel();
    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.stock !== undefined) updateData.stock = Boolean(body.stock);
    if (body.category !== undefined) updateData.category = body.category;
    if (body.brand !== undefined) updateData.brand = body.brand;
    if (body.presentation !== undefined) updateData.presentation = body.presentation;
    if (body.featured !== undefined) updateData.featured = Boolean(body.featured);
    if (body.image_filename !== undefined) updateData.image_filename = body.image_filename;
    if (body.description !== undefined) updateData.description = body.description;

    const updated = await ProductModel.findOneAndUpdate({ id }, { $set: updateData }, { new: true }).lean();

    if (!updated) {
      return NextResponse.json({ success: false, error: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Error in PUT /api/products/[id]:", error);
    return NextResponse.json({ success: false, error: "Error al actualizar producto" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { success: false, error: "Base de datos MongoDB no conectada en .env.local" },
        { status: 503 }
      );
    }

    const ProductModel = getProductModel();
    const deleted = await ProductModel.findOneAndDelete({ id }).lean();

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error("Error in DELETE /api/products/[id]:", error);
    return NextResponse.json({ success: false, error: "Error al eliminar producto" }, { status: 500 });
  }
}
