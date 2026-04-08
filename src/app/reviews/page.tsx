import type { Metadata } from "next";
import ReviewsPage from "./ReviewsPage";
import { buildPageMetadata } from "@/lib/metadata";
import { loadFeatureProducts } from "@/lib/catalog";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "みんなのレビュー｜ユーザー投稿レビュー｜FANZAトクナビ",
  description:
    "FANZAトクナビユーザーによる作品レビュー。公式レビューだけでは分からないリアルな感想を参考にできます。",
  path: ROUTES.reviews,
});

export default async function Page() {
  const allProducts = await loadFeatureProducts({ limit: 300 });
  return <ReviewsPage allProducts={allProducts} />;
}
