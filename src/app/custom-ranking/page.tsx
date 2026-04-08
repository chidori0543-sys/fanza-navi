import type { Metadata } from "next";
import CustomRankingPage from "./CustomRankingPage";
import { ROUTES } from "@/lib/site";
import { buildPageMetadata } from "@/lib/metadata";
import {
  FEATURE_PRODUCT_POOL_LIMIT,
  loadFeatureProducts,
  loadSaleProducts,
} from "@/lib/catalog";
import type { Product } from "@/data/products";
import { getDiscountPercent } from "@/lib/product-presenter";

export const metadata: Metadata = buildPageMetadata({
  title: "独自ランキング｜コスパ・隠れた名作・新人注目作｜FANZAトクナビ",
  description:
    "FANZAトクナビ独自のランキング。コスパ最強・隠れた名作・大幅値下げ・新人注目作の4カテゴリで、公式ランキングでは見つからない作品を発見できます。",
  path: ROUTES.customRanking,
});

function buildCospaRanking(products: Product[]): Product[] {
  return [...products]
    .filter((p) => p.reviewCount > 0 && p.price > 0)
    .sort((a, b) => {
      const scoreA = a.rating / (a.salePrice ?? a.price);
      const scoreB = b.rating / (b.salePrice ?? b.price);
      return scoreB - scoreA;
    })
    .slice(0, 20);
}

function buildHiddenGemRanking(products: Product[]): Product[] {
  return [...products]
    .filter((p) => p.rating >= 4.0 && p.reviewCount > 0 && p.reviewCount < 20)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 20);
}

function buildBigDiscountRanking(saleProducts: Product[]): Product[] {
  return [...saleProducts]
    .filter((p) => {
      const d = getDiscountPercent(p);
      return d !== null && d > 0;
    })
    .sort((a, b) => {
      const dA = getDiscountPercent(a) ?? 0;
      const dB = getDiscountPercent(b) ?? 0;
      return dB - dA;
    })
    .slice(0, 20);
}

function buildNewcomerRanking(products: Product[], allProducts: Product[]): Product[] {
  // Count how many products each actress appears in across the full catalog
  const actressProductCount = new Map<string, number>();
  allProducts.forEach((p) => {
    p.actresses?.forEach((name) => {
      const key = name.trim();
      if (key) actressProductCount.set(key, (actressProductCount.get(key) ?? 0) + 1);
    });
  });

  return [...products]
    .filter((p) => {
      if (!p.actresses || p.actresses.length === 0) return false;
      // A "newcomer" product: at least one actress with ≤3 works in our catalog
      return p.actresses.some((name) => {
        const count = actressProductCount.get(name.trim()) ?? 0;
        return count > 0 && count <= 3;
      });
    })
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 20);
}

export default async function Page() {
  const [allProducts, saleProducts] = await Promise.all([
    loadFeatureProducts({ limit: FEATURE_PRODUCT_POOL_LIMIT }),
    loadSaleProducts({ limit: Math.ceil(FEATURE_PRODUCT_POOL_LIMIT * 0.5) }),
  ]);

  const cospaRanking = buildCospaRanking(allProducts);
  const hiddenGemRanking = buildHiddenGemRanking(allProducts);
  const bigDiscountRanking = buildBigDiscountRanking(saleProducts);
  const newcomerRanking = buildNewcomerRanking(allProducts, allProducts);

  return (
    <CustomRankingPage
      cospaRanking={cospaRanking}
      hiddenGemRanking={hiddenGemRanking}
      bigDiscountRanking={bigDiscountRanking}
      newcomerRanking={newcomerRanking}
    />
  );
}
