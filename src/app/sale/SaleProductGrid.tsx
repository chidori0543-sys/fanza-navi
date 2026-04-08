"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";

type SortOption = "discount" | "review" | "price-asc" | "price-desc" | "rating";

const sortLabels: Record<SortOption, string> = {
  discount: "割引率が高い順",
  review: "レビュー数が多い順",
  "price-asc": "価格が安い順",
  "price-desc": "価格が高い順",
  rating: "評価が高い順",
};

function getEffectivePrice(p: Product) {
  return p.salePrice ?? p.price;
}

function getDiscountRate(p: Product) {
  if (!p.salePrice || p.price <= 0) return 0;
  return ((p.price - p.salePrice) / p.price) * 100;
}

export default function SaleProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortOption>("discount");

  const sorted = useMemo(() => {
    const copy = [...products];
    switch (sort) {
      case "discount":
        return copy.sort((a, b) => getDiscountRate(b) - getDiscountRate(a));
      case "review":
        return copy.sort((a, b) => b.reviewCount - a.reviewCount);
      case "price-asc":
        return copy.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
      case "price-desc":
        return copy.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
      case "rating":
        return copy.sort((a, b) => b.rating - a.rating);
      default:
        return copy;
    }
  }, [products, sort]);

  return (
    <section className="mt-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          割引中の作品 <span className="text-sm font-normal text-[var(--color-text-muted)]">({sorted.length}件)</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                sort === key
                  ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                  : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
          <p className="text-[var(--color-text-secondary)]">セール作品を取得中です。しばらくお待ちください。</p>
        </div>
      )}
    </section>
  );
}
