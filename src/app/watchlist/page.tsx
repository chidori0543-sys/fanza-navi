import type { Metadata } from "next";
import WatchlistPage from "./WatchlistPage";
import { loadRankingProducts, loadSaleProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";
import type { Product } from "@/data/products";

export const metadata: Metadata = buildPageMetadata({
  title: "お気に入り＆ウォッチリスト",
  description:
    "お気に入りに追加した作品を一覧で確認。気になる作品をまとめてチェックできます。",
  path: ROUTES.watchlist,
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

  return <WatchlistPage allProducts={allProducts} />;
}
