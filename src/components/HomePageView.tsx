"use client";

import { FaArrowUp, FaBalanceScale, FaBookOpen, FaCoins, FaCreditCard } from "react-icons/fa";
import Footer from "@/components/Footer";
import GenreRail from "@/components/GenreRail";
import HeroSection from "@/components/HeroSection";
import PrimaryCta from "@/components/PrimaryCta";
import ProductGridSection from "@/components/ProductGridSection";
import RankingPodium from "@/components/RankingPodium";
import RelatedNavigation from "@/components/RelatedNavigation";
import ReviewCard from "@/components/ReviewCard";
import SectionIntro from "@/components/SectionIntro";
import StickyCTA from "@/components/StickyCTA";
import type { GenreLandingPage } from "@/data/genres";
import type { Product } from "@/data/products";
import type { Review } from "@/data/reviews";
import { ROUTES } from "@/lib/site";

const supportingGuides = [
  {
    href: ROUTES.guide,
    title: "FANZA完全ガイド",
    description: "最初の登録から購入までの流れを短時間で確認できます。",
    eyebrow: "Guide",
  },
  {
    href: ROUTES.compare,
    title: "VR・通常作品の比較",
    description: "視聴スタイルごとの違いを整理して無駄買いを減らします。",
    eyebrow: "Compare",
  },
  {
    href: ROUTES.articleFanzaPayment,
    title: "支払い方法ガイド",
    description: "クレカ、PayPay、ポイントの使い分けをまとめています。",
    eyebrow: "Payment",
  },
  {
    href: ROUTES.articleSaveMoney,
    title: "セール攻略法",
    description: "クーポンとポイント活用で購入単価を抑える記事です。",
    eyebrow: "Sale Tips",
  },
];

export default function HomePageView({
  rankingPreview,
  salePreview,
  featuredGenres,
  featuredReviews,
}: {
  rankingPreview: Product[];
  salePreview: Product[];
  featuredGenres: GenreLandingPage[];
  featuredReviews: Review[];
}) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const rankingSpotlight = rankingPreview.slice(0, 3);
  const rankingMore = rankingPreview.slice(3);

  return (
    <main className="pb-24">
      <HeroSection />

      <section className="content-shell px-4 pb-18">
        <SectionIntro
          eyebrow="Monthly Ranking"
          title="まず見ておきたい今月のランキング"
          description="売れ筋を先に把握しておくと、ジャンル選びとレビューへの入り方が安定します。まずは上位3作の温度感を見て、必要なら詳細ページで掘り下げます。"
          action={
            <PrimaryCta href={ROUTES.ranking} size="sm" variant="outline">
              ランキング一覧へ
            </PrimaryCta>
          }
        />
        <RankingPodium products={rankingSpotlight} />
        <ProductGridSection
          eyebrow="More From Ranking"
          title="ランキングからそのまま見られる作品"
          description="レビュー付きの作品を優先して、一覧から個別ページへつなげています。"
          products={rankingMore}
          columns="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
        />
      </section>

      <section className="content-shell px-4 pb-18">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ProductGridSection
            eyebrow="Sale Highlights"
            title="いま見る理由があるセール"
            description="値引き中の作品は、価格差だけでなくレビュー件数も一緒に見ておくと判断しやすくなります。"
            action={
              <PrimaryCta href={ROUTES.sale} size="sm" variant="outline">
                セール一覧へ
              </PrimaryCta>
            }
            products={salePreview}
            columns="grid-cols-1 sm:grid-cols-2"
          />

          <aside className="editorial-surface p-6 md:p-7">
            <p className="eyebrow">Buying Notes</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-text-primary)]">
              セールは、安さより順番を決めると見やすくなります。
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
              自分なら、まずランキングで王道を見て、そのあとにセールで価格差を確認します。最初からセールだけを見るより、比較の基準がぶれにくいです。
            </p>
            <div className="mt-6 space-y-3">
              <a
                href={ROUTES.articleSaveMoney}
                className="block rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 transition-colors hover:border-[var(--color-border-strong)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
                    <FaCoins size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">節約ガイドを読む</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                      クーポンやポイントの使い方を先に整理しておくと、まとめ買いでも失敗しにくいです。
                    </p>
                  </div>
                </div>
              </a>
              <a
                href={ROUTES.sale}
                className="block rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 transition-colors hover:border-[var(--color-border-strong)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
                    <FaBookOpen size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">セール会場へ進む</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                      値引き作品を一覧で見て、そのまま詳細ページやレビューへ移動できます。
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section id="genre-discovery" className="content-shell px-4 pb-18">
        <SectionIntro
          eyebrow="Genre Navigation"
          title="ジャンルから絞って、そのまま個別ページへ"
          description="人気、セール、VRなどの導線を近い場所に集めています。レビュー付きのジャンルは、そのまま読み進めて判断しやすいようにしています。"
          action={
            <PrimaryCta href={ROUTES.search} size="sm" variant="outline">
              検索入口へ
            </PrimaryCta>
          }
        />
        <GenreRail genres={featuredGenres} />
      </section>

      <section className="content-shell px-4 pb-18">
        <SectionIntro
          eyebrow="Editorial Reviews"
          title="レビューから温度感をつかむ"
          description="作品の雰囲気や向いている人を先に把握してから、詳細ページへ進めるレビューを並べています。"
          action={
            <PrimaryCta href={ROUTES.reviews} size="sm" variant="outline">
              レビュー一覧へ
            </PrimaryCta>
          }
        />
        <div className="grid gap-5 md:grid-cols-3">
          {featuredReviews.map((review) => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      </section>

      <section className="content-shell px-4 pb-20">
        <RelatedNavigation
          title="支払い方法や比較記事もまとめて見られます"
          description="作品選びの途中で迷いやすい支払い、比較、節約のガイドも、回遊しやすい場所に置いています。"
          items={supportingGuides}
        />
      </section>

      <Footer />

      <StickyCTA />

      <button
        onClick={scrollToTop}
        className="fixed bottom-20 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[rgba(17,18,21,0.9)] text-[var(--color-text-primary)] shadow-lg backdrop-blur-xl transition-colors hover:border-[var(--color-border-strong)]"
        aria-label="ページトップへ"
      >
        <FaArrowUp />
      </button>
    </main>
  );
}
