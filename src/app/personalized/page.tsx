import type { Metadata } from "next";
import PersonalizedPage from "./PersonalizedPage";
import {
  loadRankingProducts,
  loadSaleProducts,
  loadNewProducts,
} from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";
import type { Product } from "@/data/products";

export const metadata: Metadata = buildPageMetadata({
  title: "パーソナライズドフィード｜あなたへのおすすめ｜FANZAトクナビ",
  description:
    "閲覧履歴やジャンル傾向から、あなたにぴったりのFANZA作品をレコメンド。好みのジャンル新着・お得なセール品・新ジャンル開拓までパーソナライズされたフィードをお届けします。",
  path: "/personalized",
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
  const [ranking, sale, newReleases] = await Promise.all([
    loadRankingProducts({ limit: 40 }),
    loadSaleProducts({ limit: 40 }),
    loadNewProducts({ limit: 40 }),
  ]);

  const allProducts = dedupeProducts([...ranking, ...sale, ...newReleases]);

  return <PersonalizedPage allProducts={allProducts} />;
}
