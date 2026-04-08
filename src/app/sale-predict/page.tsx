import type { Metadata } from "next";
import SalePredictPage from "./SalePredictPage";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "セール予測カレンダー｜お得な買い時がわかる｜FANZAトクナビ",
  description:
    "FANZAのセール時期を過去の傾向から予測するカレンダー。月初・月中・月末セールや季節イベントの予測日程と、おすすめの購入戦略を確認できます。",
  path: "/sale-predict",
});

export default function Page() {
  return <SalePredictPage />;
}
