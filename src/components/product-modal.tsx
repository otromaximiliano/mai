"use client";

import Image from "next/image";
import { Product } from "@/types/product-types";
import { formatCurrency } from "@/utils/format-currency";
import { generateWhatsAppUrl } from "@/utils/generate-whatsapp-url";
import { X, Plus, Minus, ShoppingBag, MessageCircle, Check } from "lucide-react";
import { useState } from "react";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

function resolveProductImage(imageFilename: string): string {
  if (!imageFilename) {
    return "/images/products/playadito-clasica-500g.png";
  }
  if (imageFilename.startsWith("http://") || imageFilename.startsWith("https://")) {
    return imageFilename;
  }
  if (imageFilename.startsWith("/")) {
    return imageFilename;
  }
  return `/images/products/${imageFilename}`;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const imageUrl = resolveProductImage(product.image_filename);
  const isOutOfStock = product.stock === false;
  const lineTotal = product.price * quantity;

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 600);
  };

  const directWhatsAppUrl = generateWhatsAppUrl({
    items: [
      {
        name: product.name,
        presentation: product.presentation,
        price: product.price,
        quantity,
      },
    ],
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-apple-modal overflow-hidden border border-black/5 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-5 right-5 p-2 rounded-full bg-apple-gray text-apple-muted hover:text-apple-dark hover:bg-apple-subtle transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Image Showcase */}
          <div className="relative aspect-square w-full rounded-2xl bg-apple-gray/80 p-6 flex items-center justify-center border border-black/5">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className={`object-contain p-4 transition-all ${isOutOfStock ? "opacity-40 grayscale" : ""}`}
            />
            {product.presentation && (
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white text-apple-dark shadow-sm border border-black/5">
                {product.presentation}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              {product.brand && (
                <span className="text-xs font-bold uppercase tracking-wider text-apple-muted block mb-1">
                  {product.brand}
                </span>
              )}

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-apple-dark mb-3">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-apple-dark">
                  {formatCurrency(product.price)}
                </span>
                {quantity > 1 && (
                  <span className="text-xs text-apple-muted font-medium">
                    (Total: {formatCurrency(lineTotal)})
                  </span>
                )}
              </div>

              {product.description && (
                <p className="text-sm text-apple-muted leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {/* Stock Status only when unavailable */}
              {isOutOfStock && (
                <div className="mb-4">
                  <span className="inline-block text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                    Temporalmente agotado
                  </span>
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-4 border-t border-black/5">
              {!isOutOfStock && (
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-apple-dark">Cantidad:</span>
                  <div className="flex items-center gap-3 bg-apple-gray px-3 py-1.5 rounded-full border border-black/5">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="p-1 rounded-full hover:bg-white text-apple-dark disabled:opacity-30 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center font-bold text-sm text-apple-dark">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="p-1 rounded-full hover:bg-white text-apple-dark transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`w-full py-3.5 px-6 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${
                  isOutOfStock
                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    : added
                    ? "bg-emerald-600 text-white"
                    : "bg-apple-dark text-white hover:bg-black/90"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Agregado al carrito!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Agregar al carrito ({formatCurrency(lineTotal)})</span>
                  </>
                )}
              </button>

              {!isOutOfStock && (
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-6 rounded-full font-medium text-sm text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center gap-2 transition-colors border border-emerald-200/60"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Comprar directo por WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
