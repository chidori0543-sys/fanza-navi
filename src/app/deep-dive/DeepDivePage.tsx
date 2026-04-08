"use client";

import { useMemo, useState } from "react";
import { FaArrowRight, FaBookmark, FaIndustry, FaLink, FaSearch, FaStar, FaUserFriends } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import FavoriteButton from "@/components/FavoriteButton";
import PrimaryCta from "@/components/PrimaryCta";
import SectionIntro from "@/components/SectionIntro";
import { useFavorites } from "@/hooks/useFavorites";
import type { Product } from "@/data/products";
import { ROUTES } from "@/lib/site";
import {
  formatPriceYen,
  getPresentedCurrentPrice,
  getPrimaryFanzaCtaLabel,
} from "@/lib/product-presenter";

type DiveAxis = "actress" | "maker" | "series";

interface AxisCluster {
  axis: DiveAxis;
  name: string;
  sourceCount: number;
  products: Product[];
}

const AXIS_META: Record<DiveAxis, { icon: React.ReactNode; label: string; description: string }> = {
  actress: {
    icon: <FaUserFriends size={16} />,
    label: "同じ女優",
    description: "保存作品に出演している女優の他作品",
  },
  maker: {
    icon: <FaIndustry size={16} />,
    label: "同じメーカー",
    description: "保存作品と同じメーカーの他作品",
  },
  series: {
    icon: <FaLink size={16} />,
    label: "同じシリーズ",
    description: "保存作品と同じシリーズ・レーベルの他作品",
  },
};

function buildClusters(
  favoriteProducts: Product[],
  allProducts: Product[],
  axis: DiveAxis
): AxisCluster[] {
  const favoriteIds = new Set(favoriteProducts.map((p) => p.id));
  const clusters = new Map<string, { sourceCount: number; products: Set<string> }>();

  favoriteProducts.forEach((fav) => {
    if (axis === "actress") {
      fav.actresses?.forEach((name) => {
        const key = name.trim();
        if (!key) return;
        if (!clusters.has(key)) clusters.set(key, { sourceCount: 0, products: new Set() });
        clusters.get(key)!.sourceCount++;
      });
    } else if (axis === "maker") {
      const key = fav.maker?.trim();
      if (!key) return;
      if (!clusters.has(key)) clusters.set(key, { sourceCount: 0, products: new Set() });
      clusters.get(key)!.sourceCount++;
    } else {
      const key = (fav.series ?? fav.label)?.trim();
      if (!key) return;
      if (!clusters.has(key)) clusters.set(key, { sourceCount: 0, products: new Set() });
      clusters.get(key)!.sourceCount++;
    }
  });

  // Find matching products not already in favorites
  allProducts.forEach((p) => {
    if (favoriteIds.has(p.id)) return;
    if (axis === "actress") {
      p.actresses?.forEach((name) => {
        const entry = clusters.get(name.trim());
        if (entry) entry.products.add(p.id);
      });
    } else if (axis === "maker") {
      const entry = clusters.get(p.maker?.trim() ?? "");
      if (entry) entry.products.add(p.id);
    } else {
      const key = (p.series ?? p.label)?.trim() ?? "";
      const entry = clusters.get(key);
      if (entry) entry.products.add(p.id);
    }
  });

  const productMap = new Map(allProducts.map((p) => [p.id, p]));

  return Array.from(clusters.entries())
    .filter(([, val]) => val.products.size > 0)
    .map(([name, val]) => ({
      axis,
      name,
      sourceCount: val.sourceCount,
      products: Array.from(val.products)
        .map((id) => productMap.get(id)!)
        .filter(Boolean)
        .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
        .slice(0, 8),
    }))
    .sort((a, b) => b.sourceCount - a.sourceCount || b.products.length - a.products.length)
    .slice(0, 6);
}

function ProductMiniCard({ product }: { product: Product }) {
  const currentPrice = getPresentedCurrentPrice(product);
  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex gap-3 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition-all hover:border-[var(--color-border-strong)] hover:shadow-lg"
    >
      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-[var(--color-surface-highlight)]">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[var(--color-text-muted)]">No Image</div>
        )}
        {product.isSale && (
          <span className="absolute bottom-1 left-1 rounded-full bg-[var(--color-accent)] px-1.5 py-0.5 text-[9px] font-bold text-white">
            SALE
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-xs font-semibold leading-5 text-[var(--color-text-primary)]">{product.title}</p>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-text-primary)]">{formatPriceYen(currentPrice)}~</span>
          {product.rating > 0 && (
            <span className="flex items-center gap-0.5">
              <FaStar size={9} className="text-[#d3af6f]" />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>
        <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">{product.actresses?.slice(0, 2).join(", ")}</p>
      </div>
      <div className="absolute right-3 top-3">
        <FavoriteButton productId={product.id} size={14} />
      </div>
    </a>
  );
}

export default function DeepDivePage({ allProducts }: { allProducts: Product[] }) {
  const { ids } = useFavorites();
  const [activeAxis, setActiveAxis] = useState<DiveAxis>("actress");

  const productMap = useMemo(() => new Map(allProducts.map((p) => [p.id, p])), [allProducts]);
  const favoriteProducts = useMemo(
    () => ids.map((id) => productMap.get(id)).filter((p): p is Product => p !== undefined),
    [ids, productMap]
  );

  const clusters = useMemo(
    () => buildClusters(favoriteProducts, allProducts, activeAxis),
    [favoriteProducts, allProducts, activeAxis]
  );

  const axes: DiveAxis[] = ["actress", "maker", "series"];

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "同じ系統を深掘り" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="ウォッチリスト起点"
          title="同じ系統を深掘り"
          description="保存した作品から、同じ女優・メーカー・シリーズの関連作品を芋づる式に提案します。好みの方向性を深掘りできます。"
        />
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-text-secondary)]">
          <span className="chip inline-flex items-center gap-1"><FaUserFriends size={10} /> 女優つながり</span>
          <span className="chip inline-flex items-center gap-1"><FaIndustry size={10} /> メーカーつながり</span>
          <span className="chip inline-flex items-center gap-1"><FaLink size={10} /> シリーズつながり</span>
        </div>
      </section>

      {favoriteProducts.length === 0 ? (
        <section className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-text-muted)]">
            <FaBookmark size={24} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
            まずは作品を保存してください
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            ウォッチリストに作品を追加すると、その女優・メーカー・シリーズから関連作品を自動で提案します。
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <PrimaryCta href={ROUTES.ranking} size="sm">ランキングから探す</PrimaryCta>
            <PrimaryCta href={ROUTES.discover} size="sm" variant="outline">シチュ検索</PrimaryCta>
          </div>
        </section>
      ) : (
        <>
          {/* Axis Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {axes.map((axis) => {
              const meta = AXIS_META[axis];
              return (
                <button
                  key={axis}
                  onClick={() => setActiveAxis(axis)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                    activeAxis === axis
                      ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                      : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {meta.icon} {meta.label}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-[var(--color-text-muted)]">
            ウォッチリスト {favoriteProducts.length}件 → {AXIS_META[activeAxis].description}
          </p>

          {/* Clusters */}
          {clusters.length > 0 ? (
            <div className="mt-6 space-y-8">
              {clusters.map((cluster) => (
                <section key={`${cluster.axis}-${cluster.name}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-primary-light)]">
                      {AXIS_META[cluster.axis].icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{cluster.name}</h3>
                      <p className="text-[11px] text-[var(--color-text-muted)]">
                        保存作品 {cluster.sourceCount}件から → {cluster.products.length}件のおすすめ
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {cluster.products.map((product) => (
                      <ProductMiniCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <section className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
              <p className="text-sm text-[var(--color-text-secondary)]">
                このカテゴリで関連作品が見つかりませんでした。他のタブを試すか、もっと作品を保存してみてください。
              </p>
            </section>
          )}
        </>
      )}

      {/* Bottom CTA */}
      <section className="mt-10 rounded-2xl border border-[var(--color-primary)]/20 bg-gradient-to-r from-[var(--color-primary)]/8 to-[var(--color-accent)]/5 p-6 md:p-8 text-center">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          もっと関連作品を見つけたい？
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          ウォッチリストに作品を追加するほど、提案の精度が上がります。
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <PrimaryCta href={ROUTES.watchlist} size="md">ウォッチリストへ</PrimaryCta>
          <PrimaryCta href={ROUTES.gacha} size="md" variant="outline">ガチャで発見</PrimaryCta>
        </div>
      </section>
    </main>
  );
}
