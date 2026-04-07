import type { Product } from "@/data/products";
import { getReviewByProductId } from "@/data/reviews";
import { getGenreRoute, getReviewRoute } from "@/lib/site";
import PrimaryCta from "@/components/PrimaryCta";

const PODIUM_ORDER = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1",
  "md:col-span-1",
];

export default function RankingPodium({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {products.slice(0, 3).map((product, index) => {
        const review = getReviewByProductId(product.id);
        const href = review ? getReviewRoute(review.slug) : product.affiliateUrl;

        return (
          <article
            key={product.id}
            className={`editorial-surface overflow-hidden p-5 md:p-6 ${PODIUM_ORDER[index] ?? ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-eyebrow">Rank #{product.rank ?? index + 1}</p>
                <h3 className="mt-2 text-2xl font-semibold leading-tight text-[var(--color-text-primary)]">
                  {product.title}
                </h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
                評価 {product.rating.toFixed(1)}
              </span>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)]">
              {product.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-xs text-[var(--color-text-muted)]"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Price</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xl font-semibold text-[var(--color-text-primary)]">
                    ¥{(product.salePrice ?? product.price).toLocaleString()}
                  </span>
                  {product.salePrice ? (
                    <span className="text-sm text-[var(--color-text-muted)] line-through">
                      ¥{product.price.toLocaleString()}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={getGenreRoute(product.genre)}
                  className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)]/25 hover:text-white"
                >
                  同ジャンルを見る
                </a>
                <PrimaryCta href={href} external={!review} size="sm">
                  {review ? "レビューを見る" : "FANZAで詳細を見る"}
                </PrimaryCta>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
