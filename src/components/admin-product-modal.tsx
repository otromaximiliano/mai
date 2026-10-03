"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types/product-types";
import { siteConfig } from "@/config/site-config";
import { X, Upload, Loader2, Check, AlertCircle } from "lucide-react";

interface AdminProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (savedProduct: Product) => void;
}

function resolveProductImage(imageFilename: string): string {
  if (!imageFilename) return "/images/products/playadito-clasica-500g.png";
  if (imageFilename.startsWith("http://") || imageFilename.startsWith("https://") || imageFilename.startsWith("/")) {
    return imageFilename;
  }
  return `/images/products/${imageFilename}`;
}

export function AdminProductModal({
  product,
  isOpen,
  onClose,
  onSaved,
}: AdminProductModalProps) {
  const isEditing = Boolean(product);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("yerba-mate");
  const [brand, setBrand] = useState("");
  const [presentation, setPresentation] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState("");
  const [imageFilename, setImageFilename] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setCategory(product.category || "yerba-mate");
      setBrand(product.brand || "");
      setPresentation(product.presentation || "");
      setPrice(String(product.price || 0));
      setStock(product.stock !== false);
      setFeatured(Boolean(product.featured));
      setDescription(product.description || "");
      setImageFilename(product.image_filename || "");
    } else {
      setName("");
      setCategory("yerba-mate");
      setBrand("");
      setPresentation("");
      setPrice("");
      setStock(true);
      setFeatured(false);
      setDescription("");
      setImageFilename("");
    }
    setErrorMsg("");
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImageFilename(data.filename || data.url);
      } else {
        setErrorMsg(data.error || "Error al subir la imagen");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setErrorMsg("Error de conexión al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("El nombre del producto es obligatorio.");
      return;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setErrorMsg("Ingresa un precio válido.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    try {
      const payload = {
        id: product?.id,
        name: name.trim(),
        category,
        brand: brand.trim(),
        presentation: presentation.trim(),
        price: numPrice,
        stock,
        featured,
        description: description.trim(),
        image_filename: imageFilename,
      };

      const url = isEditing ? `/api/products/${product?.id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        onSaved(result.data || payload);
        onClose();
      } else {
        setErrorMsg(result.error || "No se pudo guardar el producto");
      }
    } catch (err) {
      console.error("Error saving product:", err);
      setErrorMsg("Error de conexión al guardar el producto");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-apple-modal max-h-[90vh] overflow-y-auto border border-black/5"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-apple-muted hover:text-apple-dark hover:bg-apple-gray transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-apple-dark mb-1">
          {isEditing ? "Editar Producto" : "Nuevo Producto"}
        </h3>
        <p className="text-xs text-apple-muted mb-6">
          Completa los datos del producto. Se actualizarán inmediatamente en la tienda.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-apple-dark mb-1">
              Nombre del Producto *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Yerba Mate Playadito Clásica"
              className="w-full px-3.5 py-2.5 rounded-xl bg-apple-gray border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-apple-dark/20"
            />
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-apple-dark mb-1">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-gray border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-apple-dark/20"
              >
                {siteConfig.categories
                  .filter((c) => c.id !== "todos")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-apple-dark mb-1">
                Marca
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej: Playadito, Rutini, CBSé"
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-gray border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-apple-dark/20"
              />
            </div>
          </div>

          {/* Presentation & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-apple-dark mb-1">
                Presentación / Peso
              </label>
              <input
                type="text"
                value={presentation}
                onChange={(e) => setPresentation(e.target.value)}
                placeholder="Ej: 500 g, 1 kg, 750 ml, Unidad"
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-gray border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-apple-dark/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-apple-dark mb-1">
                Precio ({siteConfig.currency.symbol}) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ej: 18400"
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-gray border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-apple-dark/20"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-apple-dark mb-1">
              Foto del Producto
            </label>
            <div className="flex items-center gap-4 p-3 bg-apple-gray rounded-2xl border border-black/5">
              <div className="relative w-16 h-16 rounded-xl bg-white p-2 shrink-0 border border-black/5 overflow-hidden flex items-center justify-center">
                {imageFilename ? (
                  <Image
                    src={resolveProductImage(imageFilename)}
                    alt="Preview"
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                ) : (
                  <Upload className="w-6 h-6 text-apple-muted" />
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  id="admin-file-upload"
                  className="hidden"
                />
                <label
                  htmlFor="admin-file-upload"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-apple-dark border border-black/10 hover:bg-apple-subtle cursor-pointer transition-colors"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Subiendo...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>{imageFilename ? "Cambiar foto" : "Subir foto"}</span>
                    </>
                  )}
                </label>
                <p className="text-[11px] text-apple-muted mt-1 truncate">
                  {imageFilename ? imageFilename : "PNG, JPG o WebP"}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-apple-dark mb-1">
              Descripción / Notas de sabor
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles sobre el secado, sabor, notas de cata..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-apple-gray border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-apple-dark/20 resize-none"
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-apple-dark cursor-pointer">
              <input
                type="checkbox"
                checked={stock}
                onChange={(e) => setStock(e.target.checked)}
                className="w-4 h-4 rounded text-apple-dark focus:ring-0"
              />
              <span>En Stock (disponible para venta)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-apple-dark cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-apple-dark focus:ring-0"
              />
              <span>Destacado</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-black/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-apple-muted hover:text-apple-dark transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-6 py-2.5 rounded-full bg-apple-dark hover:bg-black text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEditing ? "Guardar cambios" : "Crear producto"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
