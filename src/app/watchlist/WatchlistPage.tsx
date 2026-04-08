"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookmark, FaTrash, FaStar, FaArrowRight } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import FavoriteButton from "@/components/FavoriteButton";
import PrimaryCta from "@/components/PrimaryCta";
import { useFavorites } from "@/hooks/useFavorites";
import { ROUTES } from "@/lib/site";
import type { Product } from "@/data/products";
import {
  formatPriceYen,
  getPresentedCurrentPrice,
  getPrimaryFanzaCtaLabel,
} from "@/lib/product-presenter";

export default function WatchlistPage({
  allProducts,
}: {
  allProducts: Product[];
}) {
  const { ids, toggle, count } = useFavorites();
  const [showConfirm, setShowConfirm] = useState(false);

  const productMap = new Map(allProducts.map((p) => [p.id, p]));
  const favoriteProducts = ids
    .map((id) => productMap.get(id))
    .filter((p): p is Product => p !== undefined);

  const handleClearAll = () => {
    ids.forEach((id) => toggle(id));
    setShowConfirm(false);
  };

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "ウォッチリスト" }]} />

      <section className="editorial-surface p-6 md:p-8 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]">
              <FaBookmark size={24} className="text-white" />
            </div>
            <div>
              <p className="section-eyebrow">マイリスト</p>
              <h1 className="section-title gradient-text text-3xl md:text-4xl">
                ウォッチリスト
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-semibold text-[var(--color-text-primary)]">
              <FaBookmark size={12} className="text-[var(--color-primary)]" />
              {count}件
            </span>
          </div>
        </div>
        <p className="section-description mt-3">
          気になる作品をお気に入りに追加すると、ここにまとめて表示されます。
        </p>
      </section>

      {count > 0 && (
        <div className="mb-6 flex justify-end">
          {showConfirm ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2"
            >
              <span className="text-sm text-red-300">
                本当にすべて削除しますか？
              </span>
              <button
                onClick={handleClearAll}
                className="rounded-lg bg-red-500 px-3 py-1 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                削除する
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-white"
              >
                キャンセル
              </button>
            </motion.div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-red-500/30 hover:text-red-400"
            >
              <FaTrash size={12} />
              全て削除
            </button>
          )}
        </div>
      )}

      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {favoriteProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="glass-card group relative flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/5">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FaBookmark
                        size={48}
                        className="text-[var(--color-primary)] opacity-30"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                  <div className="absolute top-3 right-3 z-10">
                    <FavoriteButton
                      productId={product.id}
                      className="h-9 w-9 bg-black/30 backdrop-blur-sm hover:bg-black/50"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col space-y-3 p-5">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <span className="inline-flex items-center gap-1">
                      <FaStar
                        size={12}
                        className="text-[var(--color-accent)]"
                      />
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {product.rating.toFixed(1)}
                      </span>
                    </span>
                    <span>レビュー {product.reviewCount}件</span>
                  </div>

                  <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-[var(--color-text-primary)] transition-colors group-hover:text-white">
                    {product.title}
                  </h3>

                  <div className="mt-auto flex items-end justify-between gap-3 border-t border-[var(--color-border)] pt-3">
                    <div>
                      <p className="text-[11px] tracking-[0.08em] text-[var(--color-text-muted)]">
                        価格
                      </p>
                      <p className="mt-1 text-xl font-semibold text-[var(--color-text-primary)]">
                        {formatPriceYen(getPresentedCurrentPrice(product))}~
                      </p>
                    </div>
                    {product.affiliateUrl.trim() && (
                      <PrimaryCta
                        href={product.affiliateUrl}
                        external
                        size="sm"
                      >
                        {getPrimaryFanzaCtaLabel(product)}
                      </PrimaryCta>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card flex flex-col items-center justify-center px-6 py-16 text-center"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-surface)]">
            <FaBookmark
              size={32}
              className="text-[var(--color-text-muted)]"
            />
          </div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            まだお気に入りに追加された作品はありません
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            作品ページのハートボタンからお気に入りに追加できます
          </p>
          <div className="mt-6">
            <PrimaryCta href={ROUTES.ranking} size="md">
              <span className="inline-flex items-center gap-2">
                人気作品を探す
                <FaArrowRight size={12} />
              </span>
            </PrimaryCta>
          </div>
        </motion.div>
      )}
    </main>
  );
}
