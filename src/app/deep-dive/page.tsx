import type { Metadata } from "next";
import DeepDivePage from "./DeepDivePage";
import { buildPageMetadata } from "@/lib/metadata";
import { loadFeatureProducts } from "@/lib/catalog";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "同じ系統を深掘り｜ウォッチリストから芋づる提案｜FANZAトクナビ",
  description:
    "保存した作品の女優・メーカー・シリーズから、同じ系統の作品を自動で芋づる式に提案。好みの方向性を深掘りできます。",
  path: ROUTES.deepDive,
});

export default async function Page() {
  const allProducts = await loadFeatureProducts({ limit: 300 });
  return <DeepDivePage allProducts={allProducts} />;
}
