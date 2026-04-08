import type { Product } from "@/data/products";

export function getProductSupportLine(product: Product): string {
  const actressLine = product.actresses?.slice(0, 2).join(" / ");
  const sourceLine = [product.maker, product.label].filter(Boolean).join(" / ");
  const tagLine = product.tags.slice(0, 2).join(" / ");

  return actressLine || sourceLine || tagLine || product.description;
}

export function getPrimaryFanzaCtaLabel(product: Product): string {
  if (product.isSale) {
    const discount = getDiscountPercent(product);
    return discount ? `🔥 ${discount}%OFF → FANZAで見る` : "🔥 セール中 → FANZAで見る";
  }
  return product.reviewCount > 0 ? "FANZAで詳細を見る" : "今すぐFANZAで見る";
}

export function formatPriceYen(price: number): string {
  return `¥${price.toLocaleString()}~`;
}

export function getPresentedCurrentPrice(product: Product): number {
  return product.salePrice ?? product.price;
}

export function getPresentedOriginalPrice(product: Product): number | null {
  return product.salePrice ? product.price : null;
}

export function getDiscountPercent(product: Product): number | null {
  if (!product.salePrice) return null;
  return Math.round(((product.price - product.salePrice) / product.price) * 100);
}
