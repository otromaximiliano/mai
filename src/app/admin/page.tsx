"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types/product-types";
import { OrderRecord } from "@/types/order-types";
import { siteConfig } from "@/config/site-config";
import { AdminAuthGuard } from "@/components/admin-auth-guard";
import { AdminProductTable } from "@/components/admin-product-table";
import { AdminProductModal } from "@/components/admin-product-modal";
import { AdminOrdersTable } from "@/components/admin-orders-table";
import {
  ArrowLeft,
  Plus,
  Package,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  DollarSign,
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error("Error loading products for admin:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const adminPin = sessionStorage.getItem("naminami_admin_pin") || "";
      const res = await fetch("/api/orders", {
        headers: {
          "x-admin-pin": adminPin,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error("Error loading orders for admin:", err);
    }
  };

  const reloadData = async () => {
    setIsLoading(true);
    await Promise.all([fetchProducts(), fetchOrders()]);
    setIsLoading(false);
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleOpenNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleProductSaved = (saved: Product) => {
    setProducts((prev) => {
      const index = prev.findIndex((p) => p.id === saved.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  };

  const handleProductUpdated = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto del catálogo?")) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const inStockCount = products.filter((p) => p.stock !== false).length;
  const outOfStockCount = products.length - inStockCount;
  const totalOrdersSum = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-apple-gray text-apple-dark">
        {/* Top Navbar */}
        <header className="bg-white border-b border-black/5 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 rounded-full hover:bg-apple-gray text-apple-muted hover:text-apple-dark transition-colors"
                title="Volver a la tienda"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-bold text-base sm:text-lg leading-tight">
                  Panel de Administración • {siteConfig.brand.name}
                </h1>
                <span className="text-[11px] text-apple-muted">
                  Gestión integral de catálogo y compras enviadas a WhatsApp
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={reloadData}
                title="Actualizar datos"
                className="p-2 rounded-full hover:bg-apple-gray text-apple-muted hover:text-apple-dark transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>

              {activeTab === "products" && (
                <button
                  onClick={handleOpenNew}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-apple-dark hover:bg-black text-white text-xs font-semibold shadow-sm active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Producto</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-black/10 pb-4">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === "products"
                  ? "bg-apple-dark text-white shadow-sm"
                  : "bg-white text-apple-muted hover:text-apple-dark border border-black/5"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Productos ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === "orders"
                  ? "bg-apple-dark text-white shadow-sm"
                  : "bg-white text-apple-muted hover:text-apple-dark border border-black/5"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Compras WhatsApp ({orders.length})</span>
            </button>
          </div>

          {activeTab === "products" ? (
            <>
              {/* Quick Metrics Products */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-black/5 flex items-center gap-4 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-apple-gray flex items-center justify-center text-apple-dark">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-apple-muted block">Total de Productos</span>
                    <span className="text-xl font-bold text-apple-dark">{products.length}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-black/5 flex items-center gap-4 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-apple-muted block">Disponibles en Stock</span>
                    <span className="text-xl font-bold text-emerald-700">{inStockCount}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-black/5 flex items-center gap-4 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-apple-muted block">Agotados / Pausados</span>
                    <span className="text-xl font-bold text-rose-700">{outOfStockCount}</span>
                  </div>
                </div>
              </div>

              {/* Table Products */}
              <AdminProductTable
                products={products}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteProduct}
                onUpdateProduct={handleProductUpdated}
              />
            </>
          ) : (
            <>
              {/* Quick Metrics Orders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-black/5 flex items-center gap-4 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-apple-muted block">Total de Pedidos Enviados</span>
                    <span className="text-xl font-bold text-apple-dark">{orders.length}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-black/5 flex items-center gap-4 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-apple-gray flex items-center justify-center text-apple-dark">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-apple-muted block">Monto Total Acumulado</span>
                    <span className="text-xl font-bold text-apple-dark font-mono">
                      {totalOrdersSum.toLocaleString("es-PY")} Gs.
                    </span>
                  </div>
                </div>
              </div>

              {/* Table Orders */}
              <AdminOrdersTable orders={orders} />
            </>
          )}
        </main>

        {/* Create / Edit Modal */}
        <AdminProductModal
          product={editingProduct}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSaved={handleProductSaved}
        />
      </div>
    </AdminAuthGuard>
  );
}
