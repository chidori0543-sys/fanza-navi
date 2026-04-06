"use client";

import { FaArrowRight, FaStar } from "react-icons/fa";
import type { Review } from "@/data/reviews";
import { getGenreRoute, getReviewRoute } from "@/lib/site";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="glass-card h-full overflow-hidden border border-white/10">
      <div
        role="img"
        aria-label={review.heroImageAlt}
        className="relative flex aspect-[16/9] items-end overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/20 via-[var(--color-accent)]/10 to-white/5 p-5"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(228,0,127,0.25),transparent_45%)]" />
        <span className="relative inline-flex rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white">
          {review.productTitle}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-secondary)]">
          <span className="rounded-full bg-[var(--color-primary)]/15 px-2 py-1 font-bold text-[var(--color-primary)]">
            レビュー
          </span>
          <span className="flex items-center gap-1 text-yellow-400">
            <FaStar size={11} />
            {review.rating.toFixed(1)}
          </span>
          <span>{review.reviewCount}件</span>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-bold leading-tight">
            <a href={getReviewRoute(review.slug)} className="hover:text-[var(--color-primary-light)]">
              {review.title}
            </a>
          </h3>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {review.excerpt}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {review.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-[var(--color-text-secondary)]"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <a
            href={getGenreRoute(review.genreSlug)}
            className="text-xs font-bold text-[var(--color-text-secondary)] hover:text-white"
          >
            同ジャンルを見る
          </a>
          <a
            href={getReviewRoute(review.slug)}
            aria-label={`${review.title}のレビューを読む`}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            レビューを読む <FaArrowRight size={11} />
          </a>
        </div>
      </div>
    </article>
  );
}
