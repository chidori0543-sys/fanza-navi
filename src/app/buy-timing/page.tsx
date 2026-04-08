import type { Metadata } from "next";
import BuyTimingPage from "./BuyTimingPage";
import { buildPageMetadata } from "@/lib/metadata";
import { fetchSaleProducts, toProduct } from "@/lib/dmm-api";

export const metadata: Metadata = buildPageMetadata({
  title: "買い時判定ツール｜今買うべき？を5秒で診断｜FANZAトクナビ",
  description:
    "FANZA作品の買い時を独自スコアで判定。セール状況・割引率・評価・季節ボーナスを総合的に分析して「今が買い時」かどうかを診断します。",
  path: "/buy-timing",
});

export default async function Page() {
  const raw = await fetchSaleProducts(50);
  const products = raw.map((item, i) => toProduct(item, i + 1, { isSale: true }));

  return <BuyTimingPage products={products} />;
}
