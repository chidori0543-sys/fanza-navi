import Breadcrumb from "@/components/Breadcrumb";
import GenreRail from "@/components/GenreRail";
import PrimaryCta from "@/components/PrimaryCta";
import ProductGridSection from "@/components/ProductGridSection";
import RelatedNavigation from "@/components/RelatedNavigation";
import SaleProductGrid from "./SaleProductGrid";
import SectionIntro from "@/components/SectionIntro";
import { genrePages } from "@/data/genres";
import { loadSaleProducts, loadRankingProducts } from "@/lib/catalog";
import { ROUTES, getGenreRoute } from "@/lib/site";

const featuredGenres = genrePages.filter((genre) =>
  ["sale", "popular", "high-rated"].includes(genre.slug)
);

export default async function SalePage() {
  const [saleProducts, rankingProducts] = await Promise.all([
    loadSaleProducts({ limit: 40 }),
    loadRankingProducts({ limit: 20 }),
  ]);

  // Mark ranking products that are on sale
  const saleIds = new Set(saleProducts.map(p => p.id));
  const popularOnSale = rankingProducts.filter(p => p.isSale && !saleIds.has(p.id));
  const allSaleProducts = [...saleProducts, ...popularOnSale];

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "セール" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="セール速報"
          title="🔥 現在開催中のセール情報"
          description="DMM APIから取得した最新のセール・割引作品です。並べ替えで自分に合った作品を見つけましょう。"
          action={
            <PrimaryCta href={ROUTES.articleSaveMoney} size="sm" variant="outline">
              節約ガイドへ
            </PrimaryCta>
          }
        />

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--color-text-secondary)]">
          <span className="chip">💰 割引率で比較</span>
          <span className="chip">⭐ レビュー数で選ぶ</span>
          <span className="chip">📊 価格が安い順で探す</span>
        </div>
      </section>

      {/* Registration CTA for new users */}
      <section className="mt-6 rounded-2xl border border-[var(--color-primary)]/20 bg-gradient-to-r from-[var(--color-primary)]/8 to-[var(--color-accent)]/5 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[var(--color-text-primary)]">
              🎁 FANZA未登録なら初回限定クーポンでさらにお得！
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              無料会員登録で使えるクーポンと、セール割引を併用すれば最大80%OFF以上も。
            </p>
          </div>
          <PrimaryCta href={ROUTES.guide} size="md">
            無料登録ガイドを見る
          </PrimaryCta>
        </div>
      </section>

      <SaleProductGrid products={allSaleProducts} />

      <section className="mt-10">
        <SectionIntro
          eyebrow="関連ジャンル"
          title="関連ジャンルから探す"
          description="セール以外の切り口でも作品を探せます。"
        />
        <GenreRail genres={featuredGenres} />
      </section>

      <RelatedNavigation
        title="もっとお得に買うために"
        description="セール情報だけでなく、クーポンやポイント活用術もチェック。"
        items={[
          {
            href: ROUTES.articleSaleCalendar,
            title: "年間セールカレンダー",
            description: "FANZAのセール開催時期を年間カレンダーで確認。",
            eyebrow: "セール時期",
          },
          {
            href: ROUTES.articleSaveMoney,
            title: "節約ガイド",
            description: "クーポンとポイントの使い方を整理できます。",
            eyebrow: "節約術",
          },
          {
            href: ROUTES.guide,
            title: "初心者ガイド",
            description: "初回クーポンの使い方や登録方法を確認。",
            eyebrow: "はじめての方",
          },
        ]}
      />
    </main>
  );
}
