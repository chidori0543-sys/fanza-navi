import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import GenreRail from "@/components/GenreRail";
import PrimaryCta from "@/components/PrimaryCta";
import ProductGridSection from "@/components/ProductGridSection";
import RankingPodium from "@/components/RankingPodium";
import RelatedNavigation from "@/components/RelatedNavigation";
import ReviewCard from "@/components/ReviewCard";
import SectionIntro from "@/components/SectionIntro";
import { genrePages } from "@/data/genres";
import { reviews } from "@/data/reviews";
import { loadRankingProducts } from "@/lib/catalog";
import { ROUTES, getGenreRoute, getReviewRoute } from "@/lib/site";

const featuredGenres = genrePages.filter((genre) =>
  ["popular", "high-rated", "vr"].includes(genre.slug)
);

const featuredReviews = reviews.filter((review) =>
  ["popular", "sale"].includes(review.genreSlug)
);

export default async function RankingPage() {
  const products = await loadRankingProducts({ limit: 8 });
  const podiumProducts = products.slice(0, 3);
  const moreProducts = products.slice(3);

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "ランキング" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="Monthly Discovery"
          title="月間ランキング"
          description="今月の売れ筋を起点に、レビュー件数と評価の厚みまで見比べやすい形にまとめています。売れている理由を短時間で掴んでから、詳細ページやレビューへ進める設計です。"
          action={
            <PrimaryCta href={ROUTES.reviews} size="sm" variant="outline">
              レビュー一覧へ
            </PrimaryCta>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">Focus</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              まずは上位3作を見て、いま動いている定番の雰囲気を掴みます。
            </p>
          </div>
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">Compare</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              評価点だけでなく、レビュー件数も一緒に見ると外しにくくなります。
            </p>
          </div>
          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="eyebrow">Route</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              ランキングからレビューや近いジャンルへそのまま横移動できます。
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <SectionIntro
          eyebrow="Top 3"
          title="今月の上位3作"
          description="まずはここだけ見ておけば、サイト全体の回遊がしやすくなります。レビューがある作品は、詳細へ進む前にひと呼吸置けるようにしています。"
        />
        <RankingPodium products={podiumProducts} />
      </section>

      <section className="mt-12">
        <SectionIntro
          eyebrow="Review Route"
          title="レビューから人気作の傾向をつかむ"
          description="売れ筋の理由を短時間で把握しやすいレビューを先に読めます。勢いで購入に進む前に、作風と向き不向きを掴みたい人向けの導線です。"
          action={
            <PrimaryCta href={getReviewRoute(reviews[0].slug)} size="sm" variant="outline">
              人気作レビューへ
            </PrimaryCta>
          }
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredReviews.map((review) => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionIntro
          eyebrow="Related Genres"
          title="ランキング周辺の探し方"
          description="月間上位から近いジャンルへ広げて、取りこぼしを減らせます。"
        />
        <GenreRail genres={featuredGenres} />
      </section>

      <ProductGridSection
        eyebrow="More Titles"
        title="今月よく見られている作品"
        description="上位3作で傾向を掴んだあとに、近い温度感の作品を続けて確認できます。"
        products={moreProducts}
      />

      <RelatedNavigation
        title="次に見るページ"
        description="ランキングから別の切り口へ動くときに迷いにくいよう、近いページをまとめています。"
        items={[
          {
            href: ROUTES.sale,
            title: "セール情報へ",
            description: "値下げ中の作品だけを見て価格差から比較できます。",
            eyebrow: "Sale",
          },
          {
            href: getGenreRoute("popular"),
            title: "人気作品ジャンルへ",
            description: "ランキング寄りの定番作品をジャンル単位でまとめて見られます。",
            eyebrow: "Genre",
          },
          {
            href: ROUTES.reviews,
            title: "レビュー一覧へ",
            description: "作風や向いている人を先に確認したいときの入口です。",
            eyebrow: "Review",
          },
        ]}
      />

      <Footer />
    </main>
  );
}
