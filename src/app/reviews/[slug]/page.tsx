import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import ProductGridSection from "@/components/ProductGridSection";
import { sampleProducts } from "@/data/products";
import { getGenreBySlug } from "@/data/genres";
import { getReviewBySlug, reviewSlugs } from "@/data/reviews";
import { loadRelatedProducts } from "@/lib/catalog";
import { ROUTES, getGenreRoute, getReviewRoute, toAbsoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return reviewSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const review = getReviewBySlug(slug);

  if (!review) {
    return {};
  }

  const path = getReviewRoute(review.slug);

  return {
    title: review.title,
    description: review.excerpt,
    alternates: {
      canonical: toAbsoluteUrl(path),
    },
    openGraph: {
      title: review.title,
      description: review.excerpt,
      type: "article",
      url: toAbsoluteUrl(path),
      publishedTime: review.publishedAt,
      modifiedTime: review.updatedAt,
      images: [
        {
          url: toAbsoluteUrl(review.heroImageUrl),
          width: 1200,
          height: 630,
          alt: review.heroImageAlt,
        },
      ],
    },
  };
}

function sortRelatedProducts(preferredIds: string[], currentId: string, products: typeof sampleProducts) {
  const order = new Map(preferredIds.map((id, index) => [id, index]));

  return [...products]
    .filter((product) => product.id !== currentId)
    .sort((left, right) => {
      const leftIndex = order.get(left.id) ?? Number.POSITIVE_INFINITY;
      const rightIndex = order.get(right.id) ?? Number.POSITIVE_INFINITY;

      if (leftIndex !== rightIndex) {
        return leftIndex - rightIndex;
      }

      return right.rating - left.rating;
    });
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const review = getReviewBySlug(slug);

  if (!review) {
    notFound();
  }

  const [product, genre, relatedProducts] = await Promise.all([
    Promise.resolve(sampleProducts.find((item) => item.id === review.productId)),
    Promise.resolve(getGenreBySlug(review.genreSlug)),
    loadRelatedProducts({
      currentId: review.productId,
      genre: review.genreSlug,
      articleId: getGenreBySlug(review.genreSlug)?.articleId,
      limit: 4,
    }),
  ]);

  if (!product) {
    notFound();
  }

  const sortedRelatedProducts = sortRelatedProducts(
    review.relatedProductIds,
    review.productId,
    relatedProducts
  ).slice(0, 4);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "レビュー一覧", href: ROUTES.reviews },
          genre ? { label: genre.name, href: getGenreRoute(genre.slug) } : { label: "レビュー" },
          { label: review.title },
        ]}
      />

      <article className="glass-card overflow-hidden border border-white/10">
        <div className="relative flex min-h-64 items-end overflow-hidden bg-black p-8">
          <img
            src={review.heroImageUrl}
            alt={review.heroImageAlt}
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_35%)]" />
          <div className="relative max-w-3xl">
            <p className="mb-3 text-sm font-bold text-[var(--color-primary)]">
              REVIEW / {review.productTitle}
            </p>
            <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">{review.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
              {review.excerpt}
            </p>
          </div>
        </div>

        <div className="grid gap-8 p-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
              <span>公開: {review.publishedAt}</span>
              <span>更新: {review.updatedAt}</span>
              <span>評価 {review.rating.toFixed(1)} / 5</span>
              <span>{review.reviewCount}件</span>
            </div>

            <div className="space-y-5 text-[15px] leading-8 text-[var(--color-text-secondary)]">
              {review.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6">
            <div>
              <p className="text-sm font-bold text-[var(--color-primary)]">総評</p>
              <h2 className="mt-2 text-xl font-extrabold">{product.title}</h2>
            </div>
            <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
              {product.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-2 py-1 text-xs text-[var(--color-text-secondary)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <a
              href={review.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-5 py-4 text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              {review.ctaLabel}
            </a>
          </aside>
        </div>
      </article>

      <ProductGridSection title="👀 こちらもおすすめ" products={sortedRelatedProducts} />

      <Footer />
    </main>
  );
}
