"use client";

import { OrderRecord } from "@/types/order-types";
import { formatCurrency } from "@/utils/format-currency";
import { MessageCircle, User, Calendar, FileText, CheckCircle2 } from "lucide-react";

interface AdminOrdersTableProps {
  orders: OrderRecord[];
}

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-black/5 p-12 text-center shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-apple-gray text-apple-muted flex items-center justify-center mx-auto mb-3">
          <MessageCircle className="w-6 h-6 stroke-1" />
        </div>
        <h3 className="font-semibold text-apple-dark text-sm mb-1">No hay compras registradas</h3>
        <p className="text-xs text-apple-muted max-w-sm mx-auto">
          Cada vez que un cliente inicie un pedido y lo envíe a WhatsApp, quedará registrado aquí automáticamente.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-apple-gray/50 border-b border-black/5 text-apple-muted font-semibold">
              <th className="py-3 px-4">Código / Fecha</th>
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">Productos</th>
              <th className="py-3 px-4">Nota / Entrega</th>
              <th className="py-3 px-4 text-right">Total</th>
              <th className="py-3 px-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 text-apple-dark">
            {orders.map((order) => {
              const formattedDate = order.created_at
                ? new Date(order.created_at).toLocaleString("es-PY", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—";

              return (
                <tr key={order.order_code} className="hover:bg-apple-gray/30 transition-colors">
                  <td className="py-3.5 px-4 align-top">
                    <span className="font-mono font-bold text-apple-dark block">
                      {order.order_code}
                    </span>
                    <span className="text-[11px] text-apple-muted flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 shrink-0" />
                      {formattedDate}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 align-top">
                    {order.customer_name ? (
                      <span className="font-medium text-apple-dark flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-apple-muted shrink-0" />
                        {order.customer_name}
                      </span>
                    ) : (
                      <span className="text-apple-muted italic">Sin nombre especificado</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 align-top max-w-xs">
                    <ul className="space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="text-[11px] text-apple-dark flex items-start justify-between gap-2">
                          <span>
                            <strong>{item.quantity}x</strong> {item.name}
                            {item.presentation ? ` (${item.presentation})` : ""}
                          </span>
                          <span className="text-apple-muted font-mono shrink-0">
                            {formatCurrency(item.line_total || item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="py-3.5 px-4 align-top max-w-xs">
                    {order.customer_note ? (
                      <p className="text-[11px] text-apple-dark flex items-start gap-1 bg-apple-gray/50 p-2 rounded-lg border border-black/5">
                        <FileText className="w-3.5 h-3.5 text-apple-muted shrink-0 mt-0.5" />
                        <span>{order.customer_note}</span>
                      </p>
                    ) : (
                      <span className="text-apple-muted text-[11px]">—</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 align-top text-right">
                    <span className="font-bold text-sm text-apple-dark block font-mono">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 align-top text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
