"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaListOl,
  FaCheckCircle,
  FaBookOpen,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaRegCircle,
  FaArrowRight,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import type { Product } from "@/data/products";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SeriesInfo {
  name: string;
  products: Product[];
  avgRating: number;
  totalReviews: number;
}

interface Props {
  seriesData: SeriesInfo[];
}

/* ------------------------------------------------------------------ */
/*  localStorage helpers                                               */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "fanza-series-watched";

function loadWatched(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveWatched(data: Record<string, string[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ------------------------------------------------------------------ */
/*  Fallback static series data                                        */
/* ------------------------------------------------------------------ */

const FALLBACK_SERIES: SeriesInfo[] = [
  {
    name: "人気シリーズA",
    products: Array.from({ length: 8 }, (_, i) => ({
      id: `fallback-a-${i}`,
      title: `人気シリーズA Vol.${i + 1}`,
      description: "人気シリーズ",
      imageUrl: "",
      affiliateUrl: "#",
      price: 1980 + i * 100,
      rating: 3.8 + (i % 5) * 0.2,
      reviewCount: 20 + i * 5,
      genre: "popular",
      tags: ["人気"],
      releaseDate: `2024-0${(i % 9) + 1}-15`,
    })),
    avgRating: 4.1,
    totalReviews: 180,
  },
  {
    name: "人気シリーズB",
    products: Array.from({ length: 6 }, (_, i) => ({
      id: `fallback-b-${i}`,
      title: `人気シリーズB 第${i + 1}弾`,
      description: "話題のシリーズ",
      imageUrl: "",
      affiliateUrl: "#",
      price: 2480 + i * 50,
      rating: 3.5 + (i % 4) * 0.3,
      reviewCount: 15 + i * 3,
      genre: "popular",
      tags: ["話題"],
      releaseDate: `2024-0${(i % 9) + 1}-20`,
    })),
    avgRating: 3.9,
    totalReviews: 105,
  },
  {
    name: "人気シリーズC",
    products: Array.from({ length: 10 }, (_, i) => ({
      id: `fallback-c-${i}`,
      title: `人気シリーズC #${i + 1}`,
      description: "大人気シリーズ",
      imageUrl: "",
      affiliateUrl: "#",
      price: 1480 + i * 80,
      rating: 4.0 + (i % 3) * 0.15,
      reviewCount: 30 + i * 4,
      genre: "popular",
      tags: ["大人気"],
      releaseDate: `2024-0${(i % 9) + 1}-10`,
    })),
    avgRating: 4.2,
    totalReviews: 310,
  },
];

/* ------------------------------------------------------------------ */
/*  Progress Bar component                                             */
/* ------------------------------------------------------------------ */

function ProgressBar({ ratio }: { ratio: number }) {
  const pct = Math.round(ratio * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface)]">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="min-w-[3rem] text-right text-xs font-bold text-[var(--color-primary)]">
        {pct}%
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Series Card component                                              */
/* ------------------------------------------------------------------ */

function SeriesCard({
  series,
  watched,
  onToggle,
}: {
  series: SeriesInfo;
  watched: string[];
  onToggle: (productId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const completion = series.products.length > 0
    ? watched.length / series.products.length
    : 0;

  const nextToWatch = series.products.find((p) => !watched.includes(p.id));

  return (
    <motion.div
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <FaBookOpen size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-[var(--color-text-primary)]">
            {series.name}
          </h3>
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-[var(--color-text-secondary)]">
            <span>全{series.products.length}作品</span>
            <span className="flex items-center gap-1">
              <FaStar className="text-yellow-400" size={10} />
              {series.avgRating.toFixed(1)}
            </span>
            <span>レビュー{series.totalReviews}件</span>
          </div>
          <div className="mt-3">
            <ProgressBar ratio={completion} />
          </div>
          <div className="mt-1 text-[11px] text-[var(--color-text-muted)]">
            {watched.length}/{series.products.length} 視聴済み
          </div>
        </div>
        <div className="shrink-0 pt-1 text-[var(--color-text-muted)]">
          {expanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
        </div>
      </button>

      {/* Next recommendation */}
      {nextToWatch && !expanded && (
        <div className="border-t border-[var(--color-border)] px-5 py-3">
          <p className="mb-1 text-[11px] font-medium text-[var(--color-accent)]">
            <FaArrowRight className="mr-1 inline" size={10} />
            次に見るべき作品
          </p>
          <p className="truncate text-sm text-[var(--color-text-primary)]">
            {nextToWatch.title}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            ¥{nextToWatch.price.toLocaleString()}~
          </p>
        </div>
      )}

      {/* Expanded product list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--color-border)] px-5 py-3 space-y-2">
              {series.products.map((product, idx) => {
                const isWatched = watched.includes(product.id);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                      isWatched
                        ? "bg-[var(--color-primary)]/5"
                        : "bg-[var(--color-surface)]"
                    }`}
                  >
                    <button
                      onClick={() => onToggle(product.id)}
                      className="shrink-0 transition-transform hover:scale-110"
                      aria-label={isWatched ? "未視聴に戻す" : "視聴済みにする"}
                    >
                      {isWatched ? (
                        <FaCheckCircle
                          className="text-[var(--color-primary)]"
                          size={20}
                        />
                      ) : (
                        <FaRegCircle
                          className="text-[var(--color-text-muted)]"
                          size={20}
                        />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-sm ${
                          isWatched
                            ? "text-[var(--color-text-muted)] line-through"
                            : "text-[var(--color-text-primary)]"
                        }`}
                      >
                        {product.title}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--color-text-secondary)]">
                        <span>¥{product.price.toLocaleString()}~</span>
                        {product.rating > 0 && (
                          <span className="flex items-center gap-0.5">
                            <FaStar className="text-yellow-400" size={9} />
                            {product.rating.toFixed(1)}
                          </span>
                        )}
                        {product.releaseDate && (
                          <span>{product.releaseDate.slice(0, 10)}</span>
                        )}
                      </div>
                    </div>
                    {product.affiliateUrl && product.affiliateUrl !== "#" && (
                      <a
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-[11px] font-bold text-white transition-opacity hover:opacity-80"
                      >
                        詳細
                      </a>
                    )}
                  </motion.div>
                );
              })}

              {/* Next recommendation inside expanded */}
              {nextToWatch && (
                <div className="mt-3 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-3">
                  <p className="mb-1 text-xs font-medium text-[var(--color-accent)]">
                    <FaArrowRight className="mr-1 inline" size={10} />
                    次に見るべき作品
                  </p>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">
                    {nextToWatch.title}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    ¥{nextToWatch.price.toLocaleString()}~
                    {nextToWatch.rating > 0 &&
                      ` / ${nextToWatch.rating.toFixed(1)}`}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page component                                                */
/* ------------------------------------------------------------------ */

export default function SeriesGuidePage({ seriesData }: Props) {
  const series = seriesData.length > 0 ? seriesData : FALLBACK_SERIES;

  const [watched, setWatched] = useState<Record<string, string[]>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setWatched(loadWatched());
    setMounted(true);
  }, []);

  const toggleWatched = useCallback(
    (seriesName: string, productId: string) => {
      setWatched((prev) => {
        const list = prev[seriesName] || [];
        const next = list.includes(productId)
          ? list.filter((id) => id !== productId)
          : [...list, productId];
        const updated = { ...prev, [seriesName]: next };
        saveWatched(updated);
        return updated;
      });
    },
    []
  );

  const totalProducts = series.reduce((s, sr) => s + sr.products.length, 0);
  const totalWatched = Object.values(watched).reduce(
    (s, ids) => s + ids.length,
    0
  );

  return (
    <main className="content-shell px-4 py-6">
      <Breadcrumb items={[{ label: "シリーズ完走ガイド" }]} />

      {/* Hero */}
      <section className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-xs text-[var(--color-text-secondary)]">
            <FaListOl size={12} className="text-[var(--color-primary)]" />
            シリーズ完走トラッカー
          </div>
          <h1 className="gradient-text text-2xl font-black md:text-3xl">
            シリーズ完走ガイド
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-text-secondary)]">
            人気シリーズの視聴進捗を管理して、コンプリートを目指そう。
            チェックを付けると進捗が保存されます。
          </p>
        </motion.div>
      </section>

      {/* Overall stats */}
      {mounted && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-8 p-5"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-[var(--color-primary)]">
                {series.length}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                シリーズ数
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-[var(--color-accent)]">
                {totalProducts}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                総作品数
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-green-400">
                {totalWatched}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                視聴済み
              </p>
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar
              ratio={totalProducts > 0 ? totalWatched / totalProducts : 0}
            />
            <p className="mt-1 text-center text-[11px] text-[var(--color-text-muted)]">
              全体の完走率
            </p>
          </div>
        </motion.section>
      )}

      {/* Series list */}
      <section className="space-y-4">
        {series.map((sr, idx) => (
          <motion.div
            key={sr.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <SeriesCard
              series={sr}
              watched={watched[sr.name] || []}
              onToggle={(pid) => toggleWatched(sr.name, pid)}
            />
          </motion.div>
        ))}
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 rounded-2xl border border-[var(--color-primary)]/20 bg-gradient-to-r from-[var(--color-primary)]/8 to-[var(--color-accent)]/5 p-6 text-center"
      >
        <FaCheckCircle
          className="mx-auto mb-3 text-[var(--color-primary)]"
          size={28}
        />
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          シリーズをコンプリートしよう
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          まとめ買いセールを活用すれば、シリーズ全巻をお得に揃えられます。
        </p>
        <a
          href="/sale"
          className="mt-4 inline-block rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-80"
        >
          セール情報を見る
        </a>
      </motion.section>
    </main>
  );
}
