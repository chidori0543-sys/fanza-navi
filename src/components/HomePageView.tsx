"use client";

import { FaArrowUp, FaCoins, FaGift, FaPercentage, FaTicketAlt, FaTags } from "react-icons/fa";
import ActressRankingSection from "@/components/ActressRankingSection";
import GenreRail from "@/components/GenreRail";
import HeroSection from "@/components/HeroSection";
import PrimaryCta from "@/components/PrimaryCta";
import ProductCard from "@/components/ProductCard";
import ProductGridSection from "@/components/ProductGridSection";
import RankingPodium from "@/components/RankingPodium";
import RelatedNavigation from "@/components/RelatedNavigation";
import SectionIntro from "@/components/SectionIntro";
import StickyCTA from "@/components/StickyCTA";
import type { ActressRankingEntry } from "@/lib/actress-ranking";
import type { GenreLandingPage } from "@/data/genres";
import type { Product } from "@/data/products";
import { ROUTES } from "@/lib/site";

const supportingGuides = [
  {
    href: ROUTES.articles,
    title: "記事一覧",
    description: "支払い方法や節約記事をまとめて見返せます。",
    eyebrow: "記事",
  },
  {
    href: ROUTES.guide,
    title: "FANZA完全ガイド",
    description: "最初の登録から購入までの流れを短時間で確認できます。",
    eyebrow: "ガイド",
  },
  {
    href: ROUTES.compare,
    title: "VR・通常作品の比較",
    description: "視聴スタイルごとの違いを整理して無駄買いを減らします。",
    eyebrow: "比較",
  },
  {
    href: ROUTES.articleFanzaPayment,
    title: "支払い方法ガイド",
    description: "クレカ、PayPay、ポイントの使い分けをまとめています。",
    eyebrow: "支払い",
  },
  {
    href: ROUTES.articleSaveMoney,
    title: "セール攻略法",
    description: "クーポンとポイント活用で購入単価を抑える記事です。",
    eyebrow: "セール術",
  },
];

export default function HomePageView({
  leadProduct,
  saleSpotlight,
  newSpotlight,
  rankingPreview,
  salePreview,
  topActresses,
  featuredGenres,
}: {
  leadProduct?: Product;
  saleSpotlight?: Product | null;
  newSpotlight?: Product | null;
  rankingPreview: Product[];
  salePreview: Product[];
  topActresses: ActressRankingEntry[];
  featuredGenres: GenreLandingPage[];
}) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const rankingSpotlight = rankingPreview.slice(0, 3);
  const rankingMore = rankingPreview.slice(3);

  return (
    <main className="pb-24">
      <HeroSection
        leadProduct={leadProduct}
        saleSpotlight={saleSpotlight ?? undefined}
        newSpotlight={newSpotlight ?? undefined}
      />

      <section className="content-shell px-4 pb-8">
        <SectionIntro
          eyebrow="月間ランキング"
          title="今月よく見られている作品"
          description="上位から見ていくと、いま動いている作品がつかみやすいです。気になるものだけ詳細やレビューへ進めます。"
          action={
            <PrimaryCta href={ROUTES.ranking} size="sm" variant="outline">
              ランキング一覧へ
            </PrimaryCta>
          }
        />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <RankingPodium products={rankingSpotlight} />
            {rankingMore.length > 0 ? (
              <div className="mt-2.5 grid gap-3 md:grid-cols-3">
                {rankingMore.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : null}
          </div>
          <ActressRankingSection entries={topActresses} compact />
        </div>
      </section>

      <section className="content-shell px-4 pb-2">
        <div className="grid gap-3 lg:grid-cols-[1.14fr_0.86fr] lg:items-start">
          <ProductGridSection
            eyebrow="セール注目作"
            title="値下げ中の作品"
            description="価格差とレビュー件数を見ながら、いま買いやすい作品を拾えます。"
            action={
              <PrimaryCta href={ROUTES.sale} size="sm" variant="outline">
                セール一覧へ
              </PrimaryCta>
            }
            products={salePreview}
            columns="grid-cols-1 sm:grid-cols-2"
            compact
          />

          <aside className="editorial-surface p-4 md:p-5 lg:sticky lg:top-20 space-y-4">
            <div>
              <p className="eyebrow flex items-center gap-1.5">
                <FaTags size={10} />
                セール・キャンペーン情報
              </p>
              <h2 className="mt-1.5 text-[1.25rem] font-semibold text-[var(--color-text-primary)]">
                お得に購入するヒント
              </h2>
            </div>

            <div className="space-y-2.5">
              <div className="rounded-[20px] border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                    <FaPercentage size={12} />
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-accent)]">定期セール開催中</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                  FANZAでは毎月定期的にセールを開催。対象作品が最大70%OFFになることも。
                </p>
              </div>

              <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-surface-highlight)] text-[var(--color-primary-light)]">
                    <FaTicketAlt size={12} />
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">クーポン活用法</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                  初回限定クーポンや週末クーポンでさらにお得に。まとめ買いクーポンも定期配布中。
                </p>
              </div>

              <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
                    <FaCoins size={12} />
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">ポイント還元</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                  購入金額の最大10%がポイント還元。貯めたポイントは次回の購入に使えます。
                </p>
              </div>

              <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-surface-highlight)] text-[#7ba3d2]">
                    <FaGift size={12} />
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">キャンペーン情報</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                  季節ごとの大型セールやポイント倍増キャンペーンをお見逃しなく。
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={ROUTES.articleSaveMoney}
                className="flex items-center gap-3 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-colors hover:border-[var(--color-border-strong)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
                  <FaCoins size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">節約ガイドを読む</p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    クーポンとポイントの使い分けを確認
                  </p>
                </div>
              </a>
              <a
                href={ROUTES.sale}
                className="flex items-center gap-3 rounded-[20px] border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-4 py-3 transition-colors hover:bg-[var(--color-accent)]/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                  <FaTags size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-accent)]">セール会場へ進む</p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    値引き中の作品を今すぐチェック
                  </p>
                </div>
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section id="genre-discovery" className="content-shell px-4 pb-14">
        <SectionIntro
          eyebrow="ジャンル別"
          title="ジャンルから探す"
          description="人気、セール、VRなど、見たい切り口からそのまま進めます。"
          action={
            <PrimaryCta href={ROUTES.search} size="sm" variant="outline">
              検索入口へ
            </PrimaryCta>
          }
        />
        <GenreRail genres={featuredGenres} />
      </section>

      <section className="content-shell px-4 pb-12">
        <RelatedNavigation
          title="支払い方法や比較記事も見ておけます"
          description="作品を開く前に確認しておきたい情報だけをまとめています。"
          items={supportingGuides}
        />
      </section>

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
