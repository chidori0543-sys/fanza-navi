import ActressRankingSection from "@/components/ActressRankingSection";
import Breadcrumb from "@/components/Breadcrumb";
import EntityDiscoveryBand from "@/components/EntityDiscoveryBand";
import GenreRail from "@/components/GenreRail";
import PrimaryCta from "@/components/PrimaryCta";
import ProductCard from "@/components/ProductCard";
import RankingPodium from "@/components/RankingPodium";
import RankingTabs from "./RankingTabs";
import RelatedNavigation from "@/components/RelatedNavigation";
import SectionIntro from "@/components/SectionIntro";
import { genrePages } from "@/data/genres";
import { buildActressRanking } from "@/lib/actress-ranking";
import { loadRankingProducts } from "@/lib/catalog";
import { ROUTES, getGenreRoute } from "@/lib/site";

const featuredGenres = genrePages.filter((genre) =>
  ["popular", "high-rated", "vr"].includes(genre.slug)
);

export default async function RankingPage() {
  const products = await loadRankingProducts({ limit: 50 });
  const podiumProducts = products.slice(0, 3);
  const moreProducts = products.slice(3);
  const topActresses = buildActressRanking(products, 8);

  return (
    <main className="content-shell px-4 py-6">
      <Breadcrumb items={[{ label: "ランキング" }]} />

      <section>
        <SectionIntro
          eyebrow="売上ランキング"
          title="🏆 FANZA人気ランキング TOP50"
          description="DMM APIから取得した最新の売上ランキング。評価・レビュー件数・価格を見比べて、今最も売れている作品をチェック。"
          action={
            <PrimaryCta href={ROUTES.sale} size="sm" variant="outline">
              セール一覧へ
            </PrimaryCta>
          }
        />
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[var(--color-text-secondary)]">
          <span className="chip">🔥 上位3作で人気傾向を把握</span>
          <span className="chip">⭐ 評価とレビュー数で確認</span>
          <span className="chip">💰 セール中の作品もチェック</span>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="mt-4 rounded-2xl border border-[var(--color-primary)]/20 bg-gradient-to-r from-[var(--color-primary)]/8 to-[var(--color-accent)]/5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--color-text-secondary)]">
            <span className="font-bold text-[var(--color-text-primary)]">🎁 初めてFANZAを使う方</span> — 無料登録で初回限定クーポンがもらえます
          </p>
          <PrimaryCta href={ROUTES.guide} size="sm">
            無料登録ガイド
          </PrimaryCta>
        </div>
      </section>

      <section className="mt-4">
        <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <RankingPodium products={podiumProducts} />
            {moreProducts.length > 0 ? (
              <div className="mt-2 grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
                {moreProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : null}
          </div>
          <ActressRankingSection entries={topActresses} compact />
        </div>
      </section>

      <section className="mt-5">
        <EntityDiscoveryBand
          title="女優・メーカー・レーベルで絞る"
          description="気になる女優やメーカーから作品を探せます。"
          products={products}
          topActresses={topActresses}
          compact
        />
      </section>

      <section className="mt-7">
        <SectionIntro
          eyebrow="関連ジャンル"
          title="ジャンル別で探す"
          description="ランキングとは違う切り口で作品を発見。"
        />
        <GenreRail genres={featuredGenres} />
      </section>

      <RelatedNavigation
        title="次に見るページ"
        description="ランキングと合わせてチェックしたいページ。"
        items={[
          {
            href: ROUTES.sale,
            title: "セール情報",
            description: "値下げ中の作品を割引率で比較できます。",
            eyebrow: "セール",
          },
          {
            href: ROUTES.guide,
            title: "初心者ガイド",
            description: "初めての方は登録方法やお得な買い方をチェック。",
            eyebrow: "はじめての方",
          },
          {
            href: ROUTES.articleSaveMoney,
            title: "節約ガイド",
            description: "クーポンとポイントで安く買うテクニック。",
            eyebrow: "節約術",
          },
        ]}
      />
    </main>
  );
}
