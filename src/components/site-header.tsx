"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site-config";
import { ShoppingBag, Search, MessageCircle, SlidersHorizontal } from "lucide-react";

interface SiteHeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isSearchOpen: boolean;
  onToggleSearch: () => void;
}

export function SiteHeader({
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  isSearchOpen,
  onToggleSearch,
}: SiteHeaderProps) {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    siteConfig.whatsapp.welcomeMessage
  )}`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 border-b border-black/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-apple-dark text-white flex items-center justify-center font-bold text-sm tracking-tighter group-hover:scale-105 transition-transform">
            Ñ
          </div>
          <span className="font-semibold text-lg sm:text-xl text-apple-dark tracking-tight">
            {siteConfig.brand.name}
          </span>
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar yerbas, vinos, mates, termos..."
              className="w-full pl-10 pr-4 py-2 bg-apple-gray text-apple-dark placeholder:text-apple-muted text-sm rounded-full border border-black/5 focus:outline-none focus:ring-2 focus:ring-apple-blue/20 transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Toggle */}
          <button
            onClick={onToggleSearch}
            aria-label="Buscar"
            className="md:hidden p-2 rounded-full text-apple-dark hover:bg-apple-gray transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Direct WhatsApp Quick Chat */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Consultar por WhatsApp"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200/50"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          {/* Admin Link Icon */}
          <Link
            href="/admin"
            title="Panel de administración"
            className="p-2 rounded-full text-apple-muted hover:text-apple-dark hover:bg-apple-gray transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Link>

          {/* Shopping Bag Button */}
          <button
            onClick={onOpenCart}
            aria-label="Abrir carrito"
            className="relative flex items-center justify-center p-2.5 rounded-full bg-apple-dark text-white hover:bg-black/90 active:scale-95 transition-all shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-apple-blue text-white text-[11px] font-bold flex items-center justify-center border-2 border-white animate-in zoom-in-50">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Input Expanded */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-black/5 bg-white">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-muted" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2 bg-apple-gray text-apple-dark placeholder:text-apple-muted text-sm rounded-full border border-black/5 focus:outline-none focus:ring-2 focus:ring-apple-blue/20"
            />
          </div>
        </div>
      )}
    </header>
  );
}
