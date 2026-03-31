import type { Metadata } from "next";
import RankingPage from "./RankingPage";

export const metadata: Metadata = {
  title: "人気ランキング",
  description: "FANZAの売上・評価ランキングTOP作品を毎日更新。今一番人気の作品をチェック！",
};

export default function Page() {
  return <RankingPage />;
}
