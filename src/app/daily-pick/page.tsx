import type { Metadata } from "next";
import DailyPickPage from "./DailyPickPage";
import { loadRankingProducts, loadSaleProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";
import type { Product } from "@/data/products";

export const metadata: Metadata = buildPageMetadata({
  title: "今日のおすすめ（デイリーピック）",
  description:
    "毎日変わるおすすめ作品を厳選ピック。過去7日間のおすすめも振り返れます。",
  path: ROUTES.dailyPick,
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

  return <DailyPickPage allProducts={allProducts} />;
}
