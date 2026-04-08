import type { Metadata } from "next";
import GachaPage from "./GachaPage";
import { loadRankingProducts, loadSaleProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";
import type { Product } from "@/data/products";

export const metadata: Metadata = buildPageMetadata({
  title: "ガチャ風レコメンド",
  description:
    "ガチャを回して運命の作品に出会おう！ジャンルや価格でフィルターして、ランダムにおすすめ作品をピック。",
  path: ROUTES.gacha,
});

function dedupeProducts(products: Product[]): Product[] {
  const seen = new Set<string>();
  return products.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

export default async function Page() {
  const [ranking, sale] = await Promise.all([
    loadRankingProducts({ limit: 100 }),
    loadSaleProducts({ limit: 100 }),
  ]);

  const allProducts = dedupeProducts([...ranking, ...sale]);

  return <GachaPage allProducts={allProducts} />;
}
