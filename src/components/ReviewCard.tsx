"use client";

import { FaStar } from "react-icons/fa";
import PrimaryCta from "@/components/PrimaryCta";
import type { Review } from "@/data/reviews";
import { getGenreRoute, getReviewRoute } from "@/lib/site";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="glass-card h-full overflow-hidden border border-[var(--color-border)]">
      <div
        role="img"
        aria-label={review.heroImageAlt}
        className="relative flex aspect-[16/10] items-end overflow-hidden bg-[linear-gradient(135deg,rgba(163,55,88,0.2),rgba(211,175,111,0.08))] p-5"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_35%)]" />
        <span className="relative inline-flex rounded-full bg-black/35 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-white">
          {review.productTitle}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-secondary)]">
          <span className="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-highlight)] px-2 py-1 font-semibold text-[var(--color-accent)]">
            レビュー
          </span>
          <span className="flex items-center gap-1 text-[var(--color-accent)]">
            <FaStar size={11} />
            {review.rating.toFixed(1)}
          </span>
          <span>{review.reviewCount}件</span>
        </div>

        <div>
          <h3 className="mb-2 text-xl font-semibold leading-tight text-[var(--color-text-primary)]">
            <a href={getReviewRoute(review.slug)} className="hover:text-white">
              {review.title}
            </a>
          </h3>
          <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
            {review.lead}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs font-semibold tracking-[0.1em] text-[var(--color-text-muted)] uppercase">
            自分の結論
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
            {review.verdict}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {review.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--color-text-secondary)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
          <a
            href={getGenreRoute(review.genreSlug)}
            className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-white"
          >
            同ジャンルを見る
          </a>
          <PrimaryCta
            href={getReviewRoute(review.slug)}
            aria-label={`${review.title}のレビューを読む`}
            variant="outline"
            size="sm"
          >
            レビューを読む
          </PrimaryCta>
        </div>
      </div>
    </article>
  );
}
