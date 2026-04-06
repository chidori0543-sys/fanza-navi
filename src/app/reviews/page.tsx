import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import ReviewCard from "@/components/ReviewCard";
import { genrePages } from "@/data/genres";
import { reviews } from "@/data/reviews";
import { ROUTES, getGenreRoute, toAbsoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "レビュー一覧",
  description:
    "FANZAの人気作・VR・セール作品レビューを一覧で確認。ジャンル別ページへの導線付きで気になる作品を探せます。",
  alternates: {
    canonical: toAbsoluteUrl(ROUTES.reviews),
  },
};

export default function ReviewsIndexPage() {
  const featuredGenres = genrePages.filter((genre) =>
    ["popular", "sale", "vr"].includes(genre.slug)
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumb items={[{ label: "レビュー一覧" }]} />

      <section className="glass-card border border-white/10 p-8">
        <p className="mb-2 text-sm font-bold text-[var(--color-primary)]">Review Hub</p>
        <h1 className="text-3xl font-extrabold md:text-4xl">レビュー一覧</h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[var(--color-text-secondary)]">
          作品の雰囲気や選び方を短時間で確認したい人向けに、実用性を重視したレビューをまとめています。
          気になるジャンルページへそのまま移動して、関連作品も続けて比較できます。
        </p>
      </section>

      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-extrabold">公開中のレビュー</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-xl font-extrabold">ジャンル別に深掘りする</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {featuredGenres.map((genre) => (
            <a
              key={genre.slug}
              href={getGenreRoute(genre.slug)}
              className="rounded-2xl border border-white/10 bg-black/10 p-4 transition-colors hover:border-[var(--color-primary)]/30 hover:bg-white/10"
            >
              <div className="mb-2 text-2xl">{genre.icon}</div>
              <h3 className="mb-1 font-bold">{genre.name}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{genre.headline}</p>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
