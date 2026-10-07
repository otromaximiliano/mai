"use client";

import Image from "next/image";
import { useState } from "react";
import { CartItem } from "@/types/product-types";
import { formatCurrency } from "@/utils/format-currency";
import { generateWhatsAppUrl } from "@/utils/generate-whatsapp-url";
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowRight } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

function resolveProductImage(imageFilename: string): string {
  if (!imageFilename) return "/images/products/playadito-clasica-500g.png";
  if (imageFilename.startsWith("http://") || imageFilename.startsWith("https://") || imageFilename.startsWith("/")) {
    return imageFilename;
  }
  return `/images/products/${imageFilename}`;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (items.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 1. Log order to MongoDB API
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.product.id,
            name: i.product.name,
            presentation: i.product.presentation,
            price: i.product.price,
            quantity: i.quantity,
          })),
          customer_name: customerName,
          customer_note: customerNote,
          total_amount: totalAmount,
        }),
      });
    } catch (err) {
      console.error("Order logging failed, continuing to WhatsApp:", err);
    } finally {
      // 2. Build WhatsApp URL and redirect
      const whatsappUrl = generateWhatsAppUrl({
        items: items.map((i) => ({
          name: i.product.name,
          presentation: i.product.presentation,
          price: i.product.price,
          quantity: i.quantity,
        })),
        customerName,
        customerNote,
      });

      setIsSubmitting(false);
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-apple-gray flex items-center justify-center text-apple-dark">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-apple-dark">Bolsa de Pedidos</h2>
              <span className="text-xs text-apple-muted">
                {totalItemsCount} {totalItemsCount === 1 ? "artículo" : "artículos"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar bolsa"
            className="p-2 rounded-full text-apple-muted hover:text-apple-dark hover:bg-apple-gray transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-apple-gray flex items-center justify-center text-apple-muted mb-4">
                <ShoppingBag className="w-8 h-8 stroke-1" />
              </div>
              <h3 className="font-semibold text-apple-dark text-base mb-1">Tu bolsa está vacía</h3>
              <p className="text-xs text-apple-muted max-w-xs mb-6">
                Explora nuestro catálogo y agrega los productos que quieras pedir por WhatsApp.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-apple-dark text-white text-xs font-semibold hover:bg-black/90 transition-all"
              >
                Ver productos
              </button>
            </div>
          ) : (
            <>
              {items.map(({ product, quantity }) => {
                const imageUrl = resolveProductImage(product.image_filename);
                const lineTotal = product.price * quantity;

                return (
                  <div
                    key={product.id}
                    className="flex gap-4 p-3 rounded-2xl bg-apple-gray/50 border border-black/5 items-center justify-between"
                  >
                    <div className="relative w-16 h-16 rounded-xl bg-white shrink-0 border border-black/5 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-semibold text-xs sm:text-sm text-apple-dark truncate">
                        {product.name}
                      </h4>
                      {product.presentation && (
                        <span className="text-[11px] text-apple-muted block">
                          {product.presentation}
                        </span>
                      )}
                      <span className="text-xs font-bold text-apple-dark mt-1 block">
                        {formatCurrency(lineTotal)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-white rounded-full border border-black/5 px-2 py-1 shadow-2xs">
                        <button
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          className="p-0.5 text-apple-muted hover:text-apple-dark transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center font-bold text-xs text-apple-dark">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          className="p-0.5 text-apple-muted hover:text-apple-dark transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="p-1.5 text-apple-muted hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-end pt-2">
                <button
                  onClick={onClearCart}
                  className="text-xs text-apple-muted hover:text-rose-600 transition-colors"
                >
                  Vaciar bolsa
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-black/5 bg-apple-gray/40 space-y-4">
            {/* Customer Inputs */}
            <div className="space-y-2">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Tu nombre (opcional)"
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-black/5 placeholder:text-apple-muted focus:outline-none focus:ring-2 focus:ring-apple-blue/20"
              />
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Dirección o aclaración de entrega (opcional)"
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-black/5 placeholder:text-apple-muted focus:outline-none focus:ring-2 focus:ring-apple-blue/20"
              />
            </div>

            {/* Total */}
            <div className="flex items-baseline justify-between pt-2">
              <span className="text-sm font-medium text-apple-muted">Total Estimado</span>
              <span className="text-xl sm:text-2xl font-bold text-apple-dark">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{isSubmitting ? "Preparando WhatsApp..." : "Pedir por WhatsApp"}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <p className="text-[11px] text-center text-apple-muted leading-tight">
              Al hacer clic serás redirigido a WhatsApp para coordinar el pago y envío directamente con nosotros.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
