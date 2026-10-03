"use client";

import { siteConfig } from "@/config/site-config";
import { cn } from "@/utils/cn";

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  countsByCategory: Record<string, number>;
}

export function CategoryPills({
  selectedCategory,
  onSelectCategory,
  countsByCategory,
}: CategoryPillsProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-4 border-b border-black/5 bg-white/50 backdrop-blur-sm sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 min-w-max">
        {siteConfig.categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = countsByCategory[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95",
                isSelected
                  ? "bg-apple-dark text-white shadow-sm"
                  : "bg-apple-gray text-apple-muted hover:text-apple-dark hover:bg-apple-subtle border border-black/5"
              )}
            >
              <span>{cat.shortName}</span>
              {count > 0 && (
                <span
                  className={cn(
                    "text-[11px] px-1.5 py-0.5 rounded-full font-semibold",
                    isSelected ? "bg-white/20 text-white" : "bg-black/5 text-apple-muted"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
