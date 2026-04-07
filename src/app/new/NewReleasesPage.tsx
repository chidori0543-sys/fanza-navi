import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import GenreRail from "@/components/GenreRail";
import PrimaryCta from "@/components/PrimaryCta";
import ProductGridSection from "@/components/ProductGridSection";
import RelatedNavigation from "@/components/RelatedNavigation";
import ReviewCard from "@/components/ReviewCard";
import SectionIntro from "@/components/SectionIntro";
import { genrePages } from "@/data/genres";
import { getReviewBySlug } from "@/data/reviews";
import { loadNewProducts } from "@/lib/catalog";
import { ROUTES, getGenreRoute } from "@/lib/site";

const featuredGenres = genrePages.filter((genre) =>
  ["new-release", "vr", "popular"].includes(genre.slug)
);

const featuredReviews = [
  getReviewBySlug("vr-immersive-viewing-review"),
  getReviewBySlug("popular-series-latest-review"),
].filter((review) => review !== undefined);

export default async function NewReleasesPage() {
  const products = await loadNewProducts({ limit: 8 });

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "新作" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="New Arrival Guide"
          title="新着リリース"
          description="配信直後の作品をまとめて追える新着導線です。初回の反応が見えやすい作品を中心に並べています。"
          action={
            <PrimaryCta href={getGenreRoute("new-release")} size="sm" variant="outline">
              新作ジャンルへ
            </PrimaryCta>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">Watch</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              新作フラグ付きの作品から、今週の動きを素早く追えます。
            </p>
          </div>
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">Compare</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              まだレビュー件数が少ないときは、既存レビューで判断軸を補えます。
            </p>
          </div>
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">Expand</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              新作からVRや人気作品ページへ横断して比較できます。
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <SectionIntro
          eyebrow="Related Reviews"
          title="新作選びの補助になるレビュー"
          description="初見で選びにくいときは、人気作やVRのレビューから判断軸を補えます。"
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredReviews.map((review) => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      </section>

      <ProductGridSection
        eyebrow="New Titles"
        title="新着で見られている作品"
        description="配信直後の作品を、そのまま比較しやすい密度で並べています。"
        products={products}
      />

      <section className="mt-12">
        <SectionIntro
          eyebrow="Neighbor Genres"
          title="新着から広げる導線"
          description="発売直後の勢いだけで決めず、近いジャンルへ比較範囲を広げられます。"
        />
        <GenreRail genres={featuredGenres} />
      </section>

      <RelatedNavigation
        title="新作のあとに見ておくページ"
        description="新作だけでは判断しきれないときに、比較の軸を増やしやすいページです。"
        items={[
          {
            href: ROUTES.ranking,
            title: "月間ランキングへ",
            description: "定番側の強さを見て、新作との違いを確認できます。",
            eyebrow: "Ranking",
          },
          {
            href: ROUTES.reviews,
            title: "レビュー一覧へ",
            description: "先に作風や向いている人を読みたいときの入口です。",
            eyebrow: "Review",
          },
          {
            href: getGenreRoute("vr"),
            title: "VRジャンルへ",
            description: "没入感重視の作品を別軸で見たいときに使えます。",
            eyebrow: "Genre",
          },
        ]}
      />

      <Footer />
    </main>
  );
}
