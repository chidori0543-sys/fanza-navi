"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaThermometerHalf,
  FaChartLine,
  FaShoppingCart,
  FaStar,
  FaTag,
  FaCalendarAlt,
  FaFire,
  FaFilter,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import type { Product } from "@/data/products";

/* ------------------------------------------------------------------ */
/*  Buy-timing score calculation                                       */
/* ------------------------------------------------------------------ */

interface TimingBreakdown {
  sale: number;
  discount: number;
  rating: number;
  seasonal: number;
  newRelease: number;
  total: number;
}

function getDiscountPercent(product: Product): number {
  if (!product.salePrice || !product.price || product.price <= 0) return 0;
  return Math.round(
    ((product.price - product.salePrice) / product.price) * 100
  );
}

function calcBuyTimingScore(product: Product): TimingBreakdown {
  let sale = 0;
  let discount = 0;
  let rating = 0;
  let seasonal = 0;
  let newRelease = 0;

  // On sale: +40
  if (product.isSale || product.salePrice) {
    sale = 40;
  }

  // High discount: +20 (if > 30% off)
  const discPct = getDiscountPercent(product);
  if (discPct > 30) {
    discount = 20;
  } else if (discPct > 15) {
    discount = 10;
  }

  // High rating: +15 (if > 4.0)
  if (product.rating > 4.0) {
    rating = 15;
  } else if (product.rating > 3.5) {
    rating = 8;
  }

  // Seasonal bonus (month-based)
  const month = new Date().getMonth();
  // Big sale months in Japan: Jan (New Year), Mar (year-end), Jul (summer), Nov (BF)
  if ([0, 2, 6, 10].includes(month)) {
    seasonal = 10;
  } else if ([3, 11].includes(month)) {
    seasonal = 5;
  }

  // New release: +15
  if (product.isNew) {
    newRelease = 15;
  }

  const total = Math.min(sale + discount + rating + seasonal + newRelease, 100);
  return { sale, discount, rating, seasonal, newRelease, total };
}

type Verdict = "buy" | "wait" | "skip";

function getVerdict(score: number): Verdict {
  if (score > 70) return "buy";
  if (score >= 40) return "wait";
  return "skip";
}

const VERDICT_CONFIG: Record<
  Verdict,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  buy: {
    label: "今が買い時！",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
  },
  wait: {
    label: "もう少し待とう",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
  },
  skip: {
    label: "セールを待とう",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
};

/* ------------------------------------------------------------------ */
/*  Breakdown bar                                                      */
/* ------------------------------------------------------------------ */

function BreakdownItem({
  label,
  points,
  maxPoints,
  icon,
}: {
  label: string;
  points: number;
  maxPoints: number;
  icon: React.ReactNode;
}) {
  const pct = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="flex w-20 items-center gap-1 text-[var(--color-text-muted)]">
        {icon}
        {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-[var(--color-primary)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className="w-10 text-right font-bold text-[var(--color-text-secondary)]">
        +{points}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Verdict badge                                                      */
/* ------------------------------------------------------------------ */

function VerdictBadge({ score }: { score: number }) {
  const verdict = getVerdict(score);
  const cfg = VERDICT_CONFIG[verdict];
  const Icon =
    verdict === "buy"
      ? FaCheckCircle
      : verdict === "wait"
        ? FaClock
        : FaTimesCircle;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${cfg.borderColor} ${cfg.bgColor} ${cfg.color}`}
    >
      <Icon />
      {cfg.label}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface Props {
  products: Product[];
}

export default function BuyTimingPage({ products }: Props) {
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  const scoredProducts = useMemo(
    () =>
      products.map((p) => ({
        ...p,
        breakdown: calcBuyTimingScore(p),
      })),
    [products]
  );

  const genres = useMemo(() => {
    const set = new Set<string>();
    scoredProducts.forEach((p) => {
      if (p.genre) set.add(p.genre);
    });
    return Array.from(set);
  }, [scoredProducts]);

  const filtered = useMemo(() => {
    const list =
      selectedGenre === "all"
        ? scoredProducts
        : scoredProducts.filter((p) => p.genre === selectedGenre);
    return [...list].sort(
      (a, b) => b.breakdown.total - a.breakdown.total
    );
  }, [scoredProducts, selectedGenre]);

  const buyCount = filtered.filter(
    (p) => p.breakdown.total > 70
  ).length;
  const waitCount = filtered.filter(
    (p) => p.breakdown.total >= 40 && p.breakdown.total <= 70
  ).length;
  const skipCount = filtered.filter(
    (p) => p.breakdown.total < 40
  ).length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb items={[{ label: "買い時判定ツール" }]} />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
          <FaThermometerHalf className="mr-2 inline-block text-[var(--color-primary)]" />
          <span className="gradient-text">買い時判定ツール</span>
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          セール状況・割引率・評価を総合分析して「今が買い時か」を判定
        </p>
      </motion.div>

      {/* Summary stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid gap-4 sm:grid-cols-3"
      >
        <div className="glass-card flex items-center gap-3 p-4">
          <FaCheckCircle className="text-2xl text-green-400" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">今が買い時</p>
            <p className="text-lg font-bold text-green-400">
              {buyCount}
              <span className="text-xs text-[var(--color-text-secondary)]">
                作品
              </span>
            </p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3 p-4">
          <FaClock className="text-2xl text-yellow-400" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              もう少し待とう
            </p>
            <p className="text-lg font-bold text-yellow-400">
              {waitCount}
              <span className="text-xs text-[var(--color-text-secondary)]">
                作品
              </span>
            </p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3 p-4">
          <FaTimesCircle className="text-2xl text-red-400" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              セールを待とう
            </p>
            <p className="text-lg font-bold text-red-400">
              {skipCount}
              <span className="text-xs text-[var(--color-text-secondary)]">
                作品
              </span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Genre filter */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6 flex flex-wrap items-center gap-2"
      >
        <FaFilter className="text-[var(--color-text-secondary)]" />
        <button
          onClick={() => setSelectedGenre("all")}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
            selectedGenre === "all"
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/20 text-white"
              : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/40"
          }`}
        >
          すべて
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
              selectedGenre === genre
                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/20 text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/40"
            }`}
          >
            {genre}
          </button>
        ))}
      </motion.div>

      {/* Product list */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((product, index) => {
            const { breakdown } = product;
            const verdict = getVerdict(breakdown.total);
            const cfg = VERDICT_CONFIG[verdict];

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: Math.min(index * 0.03, 0.5) }}
                className={`glass-card overflow-hidden border ${cfg.borderColor}`}
              >
                <div className="flex flex-col gap-4 p-4 md:flex-row md:items-start md:p-5">
                  {/* Image */}
                  <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg bg-white/5">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <VerdictBadge score={breakdown.total} />
                      <span className="text-sm font-extrabold text-white">
                        {breakdown.total}点
                      </span>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-sm font-bold text-white">
                      {product.title}
                    </h3>

                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                      {product.salePrice ? (
                        <span className="flex items-center gap-1">
                          <FaTag className="text-[var(--color-accent)]" />
                          <span className="line-through">
                            ¥{product.price.toLocaleString()}
                          </span>
                          <span className="font-bold text-[var(--color-accent)]">
                            ¥{product.salePrice.toLocaleString()}~
                          </span>
                          <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-red-400">
                            -{getDiscountPercent(product)}%
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <FaTag />¥{product.price.toLocaleString()}~
                        </span>
                      )}
                      {product.rating > 0 && (
                        <span className="flex items-center gap-1">
                          <FaStar className="text-yellow-400" />
                          {product.rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-1.5">
                      <BreakdownItem
                        label="セール"
                        points={breakdown.sale}
                        maxPoints={40}
                        icon={
                          <FaShoppingCart
                            size={10}
                            className="text-green-400"
                          />
                        }
                      />
                      <BreakdownItem
                        label="割引率"
                        points={breakdown.discount}
                        maxPoints={20}
                        icon={
                          <FaTag size={10} className="text-[var(--color-accent)]" />
                        }
                      />
                      <BreakdownItem
                        label="評価"
                        points={breakdown.rating}
                        maxPoints={15}
                        icon={
                          <FaStar size={10} className="text-yellow-400" />
                        }
                      />
                      <BreakdownItem
                        label="季節"
                        points={breakdown.seasonal}
                        maxPoints={10}
                        icon={
                          <FaCalendarAlt
                            size={10}
                            className="text-blue-400"
                          />
                        }
                      />
                      <BreakdownItem
                        label="新作"
                        points={breakdown.newRelease}
                        maxPoints={15}
                        icon={
                          <FaFire size={10} className="text-orange-400" />
                        }
                      />
                    </div>
                  </div>

                  {/* Score gauge + CTA */}
                  <div className="flex shrink-0 flex-col items-center gap-3">
                    {/* Circular score */}
                    <div className="relative flex h-20 w-20 items-center justify-center">
                      <svg
                        viewBox="0 0 80 80"
                        className="h-full w-full -rotate-90"
                      >
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          fill="none"
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth="6"
                        />
                        <motion.circle
                          cx="40"
                          cy="40"
                          r="35"
                          fill="none"
                          stroke={
                            verdict === "buy"
                              ? "#4ade80"
                              : verdict === "wait"
                                ? "#facc15"
                                : "#f87171"
                          }
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 35}`}
                          initial={{
                            strokeDashoffset: 2 * Math.PI * 35,
                          }}
                          animate={{
                            strokeDashoffset:
                              2 * Math.PI * 35 * (1 - breakdown.total / 100),
                          }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </svg>
                      <span
                        className={`absolute text-xl font-extrabold ${cfg.color}`}
                      >
                        {breakdown.total}
                      </span>
                    </div>

                    <a
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:scale-105 hover:brightness-110"
                    >
                      <FaShoppingCart size={12} />
                      チェックする
                      <FaExternalLinkAlt size={10} />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-8 text-center"
        >
          <FaChartLine className="mx-auto mb-3 text-4xl text-[var(--color-text-muted)]" />
          <p className="text-[var(--color-text-secondary)]">
            現在表示できる作品がありません
          </p>
        </motion.div>
      )}

      {/* PR note */}
      <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
        ※ 買い時スコアは独自算出の目安です ※ PR
      </p>
    </main>
  );
}
