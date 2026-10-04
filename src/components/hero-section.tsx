import { siteConfig } from "@/config/site-config";
import { ArrowDown } from "lucide-react";

interface HeroSectionProps {
  onScrollToCatalog: () => void;
}

export function HeroSection({ onScrollToCatalog }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-10 sm:pt-16 sm:pb-20 border-b border-black/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-apple-dark leading-tight mb-3">
          {siteConfig.brand.name}
        </h1>

        {/* Subtitle / Description */}
        <p className="max-w-xl mx-auto text-sm sm:text-base text-apple-muted leading-relaxed mb-6">
          {siteConfig.brand.tagline}. {siteConfig.brand.description}
        </p>

        {/* Action Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={onScrollToCatalog}
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-apple-dark text-white font-medium text-xs sm:text-sm hover:bg-black/90 active:scale-95 transition-all shadow-sm"
          >
            <span>Ver productos</span>
            <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

