import type { Metadata } from "next";
import PriceHistoryPage from "./PriceHistoryPage";
import { loadRankingProducts } from "@/lib/catalog";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "価格履歴チャート｜過去最安値がわかる｜FANZAトクナビ",
  description:
    "FANZA作品の価格推移をチャートで確認。過去最安値・平均価格・値下がり率がひと目でわかり、お得な購入タイミングを逃しません。",
  path: "/price-history",
});

export default async function Page() {
  const products = await loadRankingProducts({ limit: 30 });
  return <PriceHistoryPage products={products} />;
}
