import { siteConfig } from "@/config/site-config";
import { Sparkles, ArrowDown, MessageCircle } from "lucide-react";

interface HeroSectionProps {
  onScrollToCatalog: () => void;
}

export function HeroSection({ onScrollToCatalog }: HeroSectionProps) {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    siteConfig.whatsapp.welcomeMessage
  )}`;

  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-black/5">
      {/* Subtle Apple gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-100/40 via-emerald-100/30 to-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Apple style Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-apple-gray border border-black/5 text-xs font-medium text-apple-muted mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Selección Exclusiva 2026</span>
          <span className="w-1 h-1 rounded-full bg-apple-muted/50" />
          <span className="text-apple-dark font-semibold">Envíos Directos</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-apple-dark leading-[1.1] mb-5">
          {siteConfig.brand.name}.
          <br />
          <span className="text-apple-muted font-normal">{siteConfig.brand.tagline}</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-apple-muted leading-relaxed mb-8">
          {siteConfig.brand.description}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onScrollToCatalog}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-apple-dark text-white font-medium text-sm hover:bg-black/90 active:scale-95 transition-all shadow-sm"
          >
            <span>Explorar catálogo</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-apple-gray text-apple-dark font-medium text-sm hover:bg-apple-subtle active:scale-95 transition-all border border-black/5"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Consultar disponibilidad</span>
          </a>
        </div>
      </div>
    </section>
  );
}
