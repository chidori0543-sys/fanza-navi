import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import ProductGridSection from "@/components/ProductGridSection";
import ReviewCard from "@/components/ReviewCard";
import { getGenreBySlug, genrePages, genreSlugs } from "@/data/genres";
import { getReviewsByGenreSlug } from "@/data/reviews";
import { loadGenreProducts } from "@/lib/catalog";
import { getGenreRoute, toAbsoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return genreSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const genre = getGenreBySlug(slug);

  if (!genre) {
    return {};
  }

  const path = getGenreRoute(genre.slug);

  return {
    title: `${genre.name}おすすめ作品と選び方`,
    description: `${genre.name}の注目作品をレビュー導線付きで整理。${genre.intro}`,
    alternates: {
      canonical: toAbsoluteUrl(path),
    },
    openGraph: {
      title: `${genre.name}おすすめ作品と選び方`,
      description: `${genre.name}の注目作品をレビュー導線付きで整理。${genre.intro}`,
      url: toAbsoluteUrl(path),
      images: [
        {
          url: toAbsoluteUrl("/images/ogp.svg"),
          width: 1200,
          height: 630,
          alt: `${genre.name}ページのOG画像`,
        },
      ],
    },
  };
}

export default async function GenrePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const genre = getGenreBySlug(slug);

  if (!genre) {
    notFound();
  }

  const [products, relatedReviews] = await Promise.all([
    loadGenreProducts(genre.slug, {
      articleId: genre.articleId,
      limit: 8,
    }),
    Promise.resolve(getReviewsByGenreSlug(genre.slug)),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "ジャンル別" },
          { label: genre.name },
        ]}
      />

      <section className="glass-card border border-white/10 p-8">
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <span className="text-4xl">{genre.icon}</span>
          <div>
            <p className="text-sm font-bold text-[var(--color-primary)]">Genre Landing</p>
            <h1 className="text-3xl font-extrabold md:text-4xl">{genre.name}</h1>
          </div>
        </div>

        <p className="mb-3 text-lg text-[var(--color-text-secondary)]">{genre.headline}</p>
        <p className="mb-4 max-w-3xl leading-relaxed text-[var(--color-text-secondary)]">
          {genre.intro}
        </p>
        <div className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 p-4 text-sm leading-relaxed text-white/90">
          {genre.highlight}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">レビューから探す</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              ジャンルの見どころを短時間でつかめるレビューを先に読めます。
            </p>
          </div>
        </div>

        {relatedReviews.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedReviews.map((review) => (
              <ReviewCard key={review.slug} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-secondary)]">
            このジャンルのレビューは準備中です。先に作品一覧から比較できます。
          </p>
        )}
      </section>

      <ProductGridSection title={`${genre.name}のおすすめ作品`} products={products} />

      <Footer />
    </main>
  );
}
