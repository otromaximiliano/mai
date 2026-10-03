"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product-types";
import { formatCurrency } from "@/utils/format-currency";
import { siteConfig } from "@/config/site-config";
import { Edit2, Trash2, Check, X, Search, Sparkles, Loader2 } from "lucide-react";

interface AdminProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onUpdateProduct: (updated: Product) => void;
}

function resolveProductImage(imageFilename: string): string {
  if (!imageFilename) return "/images/products/playadito-clasica-500g.png";
  if (imageFilename.startsWith("http://") || imageFilename.startsWith("https://") || imageFilename.startsWith("/")) {
    return imageFilename;
  }
  return `/images/products/${imageFilename}`;
}

export function AdminProductTable({
  products,
  onEdit,
  onDelete,
  onUpdateProduct,
}: AdminProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchesCat = categoryFilter === "todos" || p.category === categoryFilter;
    if (!matchesCat) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.presentation.toLowerCase().includes(term)
    );
  });

  const handleToggleStock = async (product: Product) => {
    setUpdatingId(product.id);
    const newStock = !product.stock;

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });

      if (res.ok) {
        onUpdateProduct({ ...product, stock: newStock });
      }
    } catch (err) {
      console.error("Failed to toggle stock:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStartEditPrice = (product: Product) => {
    setEditingPriceId(product.id);
    setTempPrice(String(product.price));
  };

  const handleSavePrice = async (product: Product) => {
    const numPrice = Number(tempPrice);
    if (isNaN(numPrice) || numPrice < 0) {
      setEditingPriceId(null);
      return;
    }

    setUpdatingId(product.id);

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: numPrice }),
      });

      if (res.ok) {
        onUpdateProduct({ ...product, price: numPrice });
      }
    } catch (err) {
      console.error("Failed to save price:", err);
    } finally {
      setEditingPriceId(null);
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o marca..."
            className="w-full pl-10 pr-4 py-2 bg-white text-xs sm:text-sm rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-apple-dark/20"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3.5 py-2 bg-white text-xs sm:text-sm rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-apple-dark/20 text-apple-dark"
        >
          {siteConfig.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-apple-gray border-b border-black/5 text-[11px] font-bold uppercase tracking-wider text-apple-muted">
                <th className="py-3.5 px-4">Producto</th>
                <th className="py-3.5 px-3">Categoría</th>
                <th className="py-3.5 px-3">Presentación</th>
                <th className="py-3.5 px-3">Precio</th>
                <th className="py-3.5 px-3 text-center">Stock</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-apple-muted">
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const imageUrl = resolveProductImage(product.image_filename);
                  const isBusy = updatingId === product.id;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-apple-gray/40 transition-colors group"
                    >
                      {/* Name & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg bg-apple-gray p-1 shrink-0 border border-black/5 overflow-hidden">
                            <Image
                              src={imageUrl}
                              alt={product.name}
                              fill
                              sizes="44px"
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-apple-dark">
                                {product.name}
                              </span>
                              {product.featured && (
                                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                              )}
                            </div>
                            {product.brand && (
                              <span className="text-[11px] text-apple-muted block">
                                {product.brand}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-apple-gray text-apple-muted border border-black/5">
                          {siteConfig.categories.find((c) => c.id === product.category)?.shortName ||
                            product.category}
                        </span>
                      </td>

                      {/* Presentation */}
                      <td className="py-3 px-3 text-apple-muted text-xs">
                        {product.presentation || "-"}
                      </td>

                      {/* Price (Fast Inline Edit) */}
                      <td className="py-3 px-3">
                        {editingPriceId === product.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(e.target.value)}
                              className="w-24 px-2 py-1 rounded bg-white border border-apple-dark text-xs font-bold"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSavePrice(product);
                                if (e.key === "Escape") setEditingPriceId(null);
                              }}
                            />
                            <button
                              onClick={() => handleSavePrice(product)}
                              className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingPriceId(null)}
                              className="p-1 rounded bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEditPrice(product)}
                            title="Haz clic para cambiar el precio rápidamente"
                            className="font-bold text-apple-dark hover:text-apple-blue hover:underline cursor-pointer"
                          >
                            {formatCurrency(product.price)}
                          </button>
                        )}
                      </td>

                      {/* Stock Switch */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggleStock(product)}
                          disabled={isBusy}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            product.stock
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                          }`}
                        >
                          {isBusy ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                product.stock ? "bg-emerald-600" : "bg-rose-600"
                              }`}
                            />
                          )}
                          <span>{product.stock ? "En Stock" : "Agotado"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEdit(product)}
                            title="Editar completo"
                            className="p-1.5 rounded-lg text-apple-muted hover:text-apple-dark hover:bg-apple-gray transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(product.id)}
                            title="Eliminar"
                            className="p-1.5 rounded-lg text-apple-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
