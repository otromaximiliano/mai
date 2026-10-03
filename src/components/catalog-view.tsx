"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Product, CartItem } from "@/types/product-types";
import { SiteHeader } from "./site-header";
import { HeroSection } from "./hero-section";
import { CategoryPills } from "./category-pills";
import { ProductCard } from "./product-card";
import { ProductModal } from "./product-modal";
import { CartDrawer } from "./cart-drawer";
import { SiteFooter } from "./site-footer";
import { siteConfig } from "@/config/site-config";
import { SearchX } from "lucide-react";

interface CatalogViewProps {
  initialProducts: Product[];
}

const CART_STORAGE_KEY = "naminami_cart_items";

export function CatalogView({ initialProducts }: CatalogViewProps) {
  const [products] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const catalogRef = useRef<HTMLDivElement>(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Could not load cart from localStorage", e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Could not save cart to localStorage", e);
    }
  }, [cart]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Counts by category
  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = { todos: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "todos" || product.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const term = searchQuery.toLowerCase().trim();
      return (
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.presentation.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    });
  }, [products, selectedCategory, searchQuery]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-apple-dark selection:bg-apple-dark selection:text-white">
      {/* Header */}
      <SiteHeader
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchOpen={isSearchOpen}
        onToggleSearch={() => setIsSearchOpen((prev) => !prev)}
      />

      {/* Hero */}
      <HeroSection onScrollToCatalog={handleScrollToCatalog} />

      {/* Catalog anchor & Category selector */}
      <div ref={catalogRef}>
        <CategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => {
            setSelectedCategory(id);
            setSearchQuery("");
          }}
          countsByCategory={countsByCategory}
        />
      </div>

      {/* Main Grid Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Results title & count */}
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-apple-dark">
              {siteConfig.categories.find((c) => c.id === selectedCategory)?.name || "Catálogo"}
            </h2>
            <span className="text-xs text-apple-muted">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}
            </span>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-apple-blue hover:underline"
            >
              Borrar búsqueda
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-apple-gray flex items-center justify-center text-apple-muted mb-4">
              <SearchX className="w-8 h-8 stroke-1" />
            </div>
            <h3 className="text-lg font-semibold text-apple-dark mb-1">
              No encontramos coincidencias
            </h3>
            <p className="text-sm text-apple-muted max-w-sm mb-6">
              Prueba con otro término de búsqueda o selecciona otra categoría.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("todos");
                setSearchQuery("");
              }}
              className="px-5 py-2.5 rounded-full bg-apple-dark text-white text-xs font-semibold hover:bg-black/90 transition-all"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
                onAddToCart={(p) => handleAddToCart(p, 1)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
