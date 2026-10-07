"use client";

import Image from "next/image";
import { Product } from "@/types/product-types";
import { formatCurrency } from "@/utils/format-currency";
import { X, Plus, Minus, ShoppingBag, Check } from "lucide-react";
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
    }, 500);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Container: Bottom Sheet in mobile (slide-in-from-bottom), Centered Modal in Desktop (zoom-in) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden border-t sm:border border-black/10 max-h-[90vh] sm:max-h-[85vh] flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
      >
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1.5 bg-black/15 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-apple-gray text-apple-muted hover:text-apple-dark hover:bg-apple-subtle transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Scrollable on mobile if needed */}
        <div className="overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 items-center">
            {/* Image Showcase */}
            <div className="relative aspect-square w-full rounded-2xl bg-apple-gray/70 overflow-hidden flex items-center justify-center border border-black/5">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className={`object-contain transition-all ${
                  isOutOfStock ? "opacity-40 grayscale" : ""
                }`}
              />
              {product.presentation && (
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white text-apple-dark shadow-sm border border-black/5">
                  {product.presentation}
                </span>
              )}
            </div>

            {/* Details & Actions */}
            <div className="flex flex-col justify-between h-full">
              <div>
                {product.brand && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-apple-muted block mb-1">
                    {product.brand}
                  </span>
                )}

                <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-apple-dark mb-2">
                  {product.name}
                </h2>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl sm:text-3xl font-bold text-apple-dark font-mono">
                    {formatCurrency(product.price)}
                  </span>
                  {quantity > 1 && (
                    <span className="text-xs text-apple-muted font-medium font-mono">
                      (Total: {formatCurrency(lineTotal)})
                    </span>
                  )}
                </div>

                {product.description && (
                  <p className="text-xs sm:text-sm text-apple-muted leading-relaxed mb-4">
                    {product.description}
                  </p>
                )}

                {/* Stock status */}
                {isOutOfStock && (
                  <div className="mb-4">
                    <span className="inline-block text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                      Temporalmente agotado
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity Controls & Add to Cart Button */}
              <div className="space-y-3 pt-3 border-t border-black/5 mt-2">
                {!isOutOfStock && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-apple-dark">Cantidad:</span>
                    <div className="flex items-center gap-3 bg-apple-gray px-3 py-1 rounded-full border border-black/5">
                      <button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className="p-1 rounded-full hover:bg-white text-apple-dark disabled:opacity-30 transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs sm:text-sm text-apple-dark">
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncrement}
                        className="p-1 rounded-full hover:bg-white text-apple-dark transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className={`w-full py-3.5 px-6 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${
                    isOutOfStock
                      ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                      : added
                      ? "bg-emerald-600 text-white shadow-emerald-600/20"
                      : "bg-apple-dark text-white hover:bg-black"
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
                      <span>Agregar al carrito • {formatCurrency(lineTotal)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
