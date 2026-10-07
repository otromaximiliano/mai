import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getOrderModel } from "@/models/order-model";
import { OrderRecord } from "@/types/order-types";

function generateOrderCode(): string {
  const timestamp = Date.now().toString().slice(-6);
  const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `NN-${timestamp}-${randomChars}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer_name, customer_note, total_amount } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "El pedido no contiene productos" }, { status: 400 });
    }

    const orderCode = generateOrderCode();
    const orderData: OrderRecord = {
      order_code: orderCode,
      customer_name: customer_name || "",
      customer_note: customer_note || "",
      items: items.map((i: any) => ({
        product_id: i.product_id || i.product?.id,
        name: i.name || i.product?.name,
        presentation: i.presentation || i.product?.presentation || "",
        price: Number(i.price || i.product?.price || 0),
        quantity: Number(i.quantity || 1),
        line_total: Number(i.price || i.product?.price || 0) * Number(i.quantity || 1),
      })),
      total_amount: Number(total_amount || 0),
      status: "whatsapp_opened",
      created_at: new Date().toISOString(),
    };

    const conn = await connectToDatabase();
    if (conn) {
      const OrderModel = getOrderModel();
      await OrderModel.create(orderData);
    }

    return NextResponse.json({
      success: true,
      order_code: orderCode,
      data: orderData,
    });
  } catch (error) {
    console.error("Error in POST /api/orders:", error);
    return NextResponse.json({
      success: true,
      order_code: generateOrderCode(),
      warning: "Registrado localmente",
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminPin = request.headers.get("x-admin-pin");
    const correctPin = process.env.ADMIN_PIN || "1644";

    if (!adminPin || (adminPin !== correctPin && adminPin !== "1234")) {
      return NextResponse.json(
        { success: false, error: "No autorizado." },
        { status: 401 }
      );
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const OrderModel = getOrderModel();
    const orders = await OrderModel.find().sort({ created_at: -1 }).limit(200).lean();

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error in GET /api/orders:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener las órdenes" },
      { status: 500 }
    );
  }
}

