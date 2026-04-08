"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaArrowRight,
  FaPen,
  FaSearch,
  FaStar,
  FaThumbsUp,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import PrimaryCta from "@/components/PrimaryCta";
import SectionIntro from "@/components/SectionIntro";
import type { Product } from "@/data/products";
import { ROUTES } from "@/lib/site";
import { formatPriceYen, getPresentedCurrentPrice } from "@/lib/product-presenter";

const REVIEWS_KEY = "fanza-navi-reviews";
const HELPFUL_KEY = "fanza-navi-review-helpful";

interface UserReview {
  id: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
}

function loadReviews(): UserReview[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveReviews(reviews: UserReview[]) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

function loadHelpful(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(HELPFUL_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function saveHelpful(ids: Set<string>) {
  localStorage.setItem(HELPFUL_KEY, JSON.stringify(Array.from(ids)));
}

const REVIEW_TAGS = [
  "ストーリー重視", "演技力", "コスパ良し", "画質が良い",
  "リピート確定", "初心者向け", "マニア向け", "VR映え",
  "長時間で満足", "シリーズ物", "期待以上", "セール推奨",
];

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-xl transition-colors ${
            star <= value ? "text-[#d3af6f]" : "text-[var(--color-text-muted)]/30"
          }`}
        >
          <FaStar />
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={size}
          className={star <= rating ? "text-[#d3af6f]" : "text-[var(--color-text-muted)]/20"}
        />
      ))}
    </span>
  );
}

export default function ReviewsPage({ allProducts }: { allProducts: Product[] }) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [helpful, setHelpful] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<number>(0);

  // Form state
  const [selectedProductId, setSelectedProductId] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    setReviews(loadReviews());
    setHelpful(loadHelpful());
  }, []);

  const productMap = useMemo(() => new Map(allProducts.map((p) => [p.id, p])), [allProducts]);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return [];
    const q = productSearch.toLowerCase();
    return allProducts
      .filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.actresses?.some((a) => a.toLowerCase().includes(q)) ||
        p.maker?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [allProducts, productSearch]);

  const displayedReviews = useMemo(() => {
    let filtered = [...reviews];
    if (filterRating > 0) {
      filtered = filtered.filter((r) => r.rating >= filterRating);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.body.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          productMap.get(r.productId)?.title.toLowerCase().includes(q)
      );
    }
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [reviews, filterRating, searchQuery, productMap]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedProductId || rating === 0 || !title.trim() || !body.trim()) return;

      const newReview: UserReview = {
        id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        productId: selectedProductId,
        rating,
        title: title.trim(),
        body: body.trim(),
        tags: selectedTags,
        createdAt: new Date().toISOString(),
      };

      const updated = [newReview, ...reviews];
      setReviews(updated);
      saveReviews(updated);

      // Reset
      setSelectedProductId("");
      setRating(0);
      setTitle("");
      setBody("");
      setSelectedTags([]);
      setProductSearch("");
      setShowForm(false);
    },
    [selectedProductId, rating, title, body, selectedTags, reviews]
  );

  const toggleHelpful = useCallback(
    (reviewId: string) => {
      const next = new Set(helpful);
      if (next.has(reviewId)) next.delete(reviewId);
      else next.add(reviewId);
      setHelpful(next);
      saveHelpful(next);
    },
    [helpful]
  );

  const deleteReview = useCallback(
    (reviewId: string) => {
      const updated = reviews.filter((r) => r.id !== reviewId);
      setReviews(updated);
      saveReviews(updated);
    },
    [reviews]
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 4)
    );
  };

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "みんなのおすすめ作品レビュー" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="ユーザー投稿"
          title="みんなのおすすめ作品レビュー"
          description="このサイトのユーザーによるおすすめ作品レビューです。公式の★だけでは分からない、リアルな感想を参考にできます。投稿したレビューはこのブラウザに保存されます。"
        />
        <div className="mt-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/20 transition-all hover:shadow-xl"
          >
            <FaPen size={12} />
            {showForm ? "フォームを閉じる" : "レビューを書く"}
          </button>
        </div>
      </section>

      {/* Review Form */}
      {showForm && (
        <section className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">レビュー投稿</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            {/* Product search */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">作品を選択</label>
              {selectedProductId ? (
                <div className="flex items-center gap-3 rounded-[18px] border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/5 p-3">
                  <img
                    src={productMap.get(selectedProductId)?.imageUrl}
                    alt=""
                    className="h-14 w-11 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-[var(--color-text-primary)]">
                      {productMap.get(selectedProductId)?.title}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {productMap.get(selectedProductId)?.actresses?.slice(0, 2).join(", ")}
                    </p>
                  </div>
                  <button type="button" onClick={() => setSelectedProductId("")} className="text-[var(--color-text-muted)]">
                    <FaTimes size={14} />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5">
                    <FaSearch size={12} className="text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="作品名・女優名で検索..."
                      className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
                    />
                  </div>
                  {filteredProducts.length > 0 && (
                    <div className="mt-2 max-h-60 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                      {filteredProducts.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedProductId(p.id);
                            setProductSearch("");
                          }}
                          className="flex w-full items-center gap-3 border-b border-[var(--color-border)] px-4 py-2.5 text-left transition-colors hover:bg-white/5 last:border-0"
                        >
                          <img src={p.imageUrl} alt="" className="h-10 w-8 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <p className="line-clamp-1 text-xs font-semibold text-[var(--color-text-primary)]">{p.title}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)]">{p.actresses?.slice(0, 2).join(", ")}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">評価</label>
              <StarInput value={rating} onChange={setRating} />
            </div>

            {/* Title */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">タイトル</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="一言でまとめると..."
                maxLength={60}
                className="w-full rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)]"
              />
            </label>

            {/* Body */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">レビュー本文</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                placeholder="良かった点、気になった点、おすすめポイントなど..."
                className="w-full rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-7 text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)]"
              />
            </label>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-primary)]">タグ（最大4つ）</label>
              <div className="flex flex-wrap gap-2">
                {REVIEW_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-[var(--color-primary)]/15 text-[var(--color-accent)] border border-[var(--color-primary)]/30"
                        : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedProductId || rating === 0 || !title.trim() || !body.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] px-5 py-3.5 text-sm font-semibold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPen size={12} /> レビューを投稿する
            </button>
          </form>
        </section>
      )}

      {/* Filter bar */}
      <section className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 flex-1 min-w-[200px]">
          <FaSearch size={12} className="text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="レビューを検索..."
            className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </div>
        <div className="flex gap-1.5">
          {[0, 3, 4, 5].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRating(r)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                filterRating === r
                  ? "bg-[var(--color-primary)]/12 text-[var(--color-accent)] border border-[var(--color-primary)]/30"
                  : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
              }`}
            >
              {r === 0 ? "全て" : `${r}+`}
            </button>
          ))}
        </div>
      </section>

      {/* Reviews list */}
      <section className="mt-6 space-y-4">
        {displayedReviews.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
            <p className="text-[var(--color-text-secondary)]">
              {reviews.length === 0
                ? "まだレビューがありません。最初のレビューを投稿してみましょう！"
                : "条件に合うレビューが見つかりませんでした。"}
            </p>
          </div>
        ) : (
          displayedReviews.map((review) => {
            const product = productMap.get(review.productId);
            return (
              <article
                key={review.id}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-border-strong)]"
              >
                {/* Product info */}
                {product && (
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4 flex items-center gap-3 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-highlight)] p-3 transition-colors hover:border-[var(--color-border-strong)]"
                  >
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt="" className="h-14 w-11 rounded-xl object-cover" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs font-semibold text-[var(--color-text-primary)]">{product.title}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        {formatPriceYen(getPresentedCurrentPrice(product))}~ ・ {product.actresses?.slice(0, 2).join(", ")}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--color-primary-light)]">
                      FANZAで見る <FaArrowRight size={8} className="inline" />
                    </span>
                  </a>
                )}

                {/* Review content */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <StarDisplay rating={review.rating} />
                    <h3 className="mt-2 text-sm font-bold text-[var(--color-text-primary)]">{review.title}</h3>
                  </div>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="shrink-0 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
                    title="削除"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
                <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)] whitespace-pre-wrap">
                  {review.body}
                </p>

                {/* Tags */}
                {review.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[10px] font-medium text-[var(--color-text-secondary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() => toggleHelpful(review.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      helpful.has(review.id)
                        ? "bg-[var(--color-primary)]/10 text-[var(--color-accent)] border border-[var(--color-primary)]/25"
                        : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
                    }`}
                  >
                    <FaThumbsUp size={10} />
                    {helpful.has(review.id) ? "参考になった" : "参考になった？"}
                  </button>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {new Date(review.createdAt).toLocaleDateString("ja-JP")}
                  </span>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Bottom CTA */}
      <section className="mt-10 rounded-2xl border border-[var(--color-primary)]/20 bg-gradient-to-r from-[var(--color-primary)]/8 to-[var(--color-accent)]/5 p-6 text-center">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          気になる作品のレビューを書いてみよう
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          あなたのレビューが、誰かの作品選びの参考になります。
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <PrimaryCta href={ROUTES.ranking} size="md">ランキングから選ぶ</PrimaryCta>
          <PrimaryCta href={ROUTES.discover} size="md" variant="outline">作品を探す</PrimaryCta>
        </div>
      </section>
    </main>
  );
}
