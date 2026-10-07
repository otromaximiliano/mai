"use client";

import Image from "next/image";
import { Product } from "@/types/product-types";
import { formatCurrency } from "@/utils/format-currency";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
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

export function ProductCard({ product, onSelect, onAddToCart }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);
  const imageUrl = resolveProductImage(product.image_filename);
  const isOutOfStock = product.stock === false;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col justify-between bg-apple-gray/60 hover:bg-apple-gray rounded-3xl p-5 border border-black/5 hover:border-black/10 transition-all duration-300 cursor-pointer hover:shadow-apple-card"
    >
      {/* Top Details (Brand or Presentation if exists) */}
      <div className="flex items-center justify-between gap-1 mb-2">
        {product.brand ? (
          <span className="text-[11px] font-medium uppercase tracking-wider text-apple-muted truncate">
            {product.brand}
          </span>
        ) : (
          <span />
        )}

        {isOutOfStock ? (
          <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
            Agotado
          </span>
        ) : product.presentation ? (
          <span className="text-[11px] text-apple-muted font-normal">
            {product.presentation}
          </span>
        ) : null}
      </div>

      {/* Image Showcase */}
      <div className="relative aspect-square w-full my-3 flex items-center justify-center overflow-hidden rounded-2xl bg-white/40 group-hover:bg-white/70 transition-colors">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn(
            "object-contain transition-transform duration-500 group-hover:scale-105",
            isOutOfStock && "opacity-40 grayscale"
          )}
        />
      </div>

      {/* Product Details & Actions */}
      <div className="pt-2">
        <h3 className="font-semibold text-sm sm:text-base text-apple-dark tracking-tight line-clamp-2 mb-1 group-hover:text-black">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-apple-muted line-clamp-1 mb-3">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-black/5 mt-auto">
          <div>
            <span className="text-xs text-apple-muted block leading-none mb-1">Precio</span>
            <span className="text-base sm:text-lg font-bold text-apple-dark">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            aria-label={justAdded ? "Añadido" : "Añadir al carrito"}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90",
              isOutOfStock
                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                : justAdded
                ? "bg-emerald-600 text-white"
                : "bg-apple-dark text-white hover:bg-black/85"
            )}
          >
            {justAdded ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
          </button>
        </div>
      </div>
    </div>
  );
}
