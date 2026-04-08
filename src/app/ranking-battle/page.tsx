import type { Metadata } from "next";
import RankingBattlePage from "./RankingBattlePage";
import { buildPageMetadata } from "@/lib/metadata";
import { fetchRanking, toProduct } from "@/lib/dmm-api";

export const metadata: Metadata = buildPageMetadata({
  title: "ランキングバトル｜トーナメント形式で推し作品を決定｜FANZAトクナビ",
  description:
    "人気FANZA作品をトーナメント形式で1対1比較！投票で勝ち残った作品があなたの推し作品に。32作品から頂点を決めよう。",
  path: "/ranking-battle",
});

export default async function Page() {
  const raw = await fetchRanking(32);
  const products = raw.map((item, i) => toProduct(item, i + 1));

  return <RankingBattlePage products={products} />;
}
