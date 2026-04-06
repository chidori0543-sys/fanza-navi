import { sampleProducts, type Product } from "@/data/products";
import {
  fetchByGenre,
  fetchNewReleases,
  fetchRanking,
  fetchSaleProducts,
  toProduct,
} from "@/lib/dmm-api";
import type { DmmProduct } from "@/lib/dmm-api";

export interface CatalogLoadOptions {
  limit?: number;
  hits?: number;
  offset?: number;
  articleId?: string;
}

export interface RelatedCatalogLoadOptions extends CatalogLoadOptions {
  currentId?: string;
  genre?: string;
}

function normalizeLimit(options: CatalogLoadOptions = {}): number {
  const limit = options.limit ?? options.hits ?? 20;
  return limit > 0 ? limit : 0;
}

const CANONICAL_GENRE_ALIASES: Record<string, string> = {
  popular: "popular",
  "人気": "popular",
  "人気作品": "popular",
  "動画": "popular",
  "new-release": "new-release",
  newrelease: "new-release",
  "新作": "new-release",
  sale: "sale",
  "セール": "sale",
  "high-rated": "high-rated",
  highrated: "high-rated",
  "高評価": "high-rated",
  amateur: "amateur",
  "素人": "amateur",
  vr: "vr",
  "VR": "vr",
};

function canonicalizeGenreKey(label?: string): string {
  const normalized = label?.trim() ?? "";
  if (!normalized) {
    return "popular";
  }

  return (
    CANONICAL_GENRE_ALIASES[normalized] ||
    CANONICAL_GENRE_ALIASES[normalized.toLowerCase()] ||
    "popular"
  );
}

function stripRank(product: Product): Product {
  const { rank, ...rest } = product;
  return rest;
}

function mergeProducts(
  primary: Product[],
  fallback: Product[],
  limit: number,
  excludedIds: Set<string> = new Set(),
  preserveRank = false
): Product[] {
  const merged: Product[] = [];
  const seen = new Set<string>();

  const push = (product: Product) => {
    if (merged.length >= limit) {
      return;
    }
    if (excludedIds.has(product.id) || seen.has(product.id)) {
      return;
    }
    seen.add(product.id);
    const next = preserveRank ? product : stripRank(product);
    if (!next.affiliateUrl.trim()) {
      return;
    }
    merged.push(next);
  };

  primary.forEach(push);
  fallback.forEach(push);

  return merged;
}

function sortByRank(products: Product[]): Product[] {
  return [...products].sort((left, right) => {
    const leftRank = left.rank ?? Number.POSITIVE_INFINITY;
    const rightRank = right.rank ?? Number.POSITIVE_INFINITY;
    return leftRank - rightRank;
  });
}

function getCuratedRanking(limit: number): Product[] {
  return sortByRank(sampleProducts).slice(0, limit);
}

function getCuratedSale(limit: number): Product[] {
  return sortByRank(sampleProducts.filter((product) => product.isSale)).slice(0, limit);
}

function getCuratedNew(limit: number): Product[] {
  return sortByRank(sampleProducts.filter((product) => product.isNew)).slice(0, limit);
}

function getCuratedGenre(genreKey: string, limit: number): Product[] {
  return sortByRank(
    sampleProducts.filter((product) => canonicalizeGenreKey(product.genre) === genreKey)
  ).slice(0, limit);
}

function getCuratedRelated(
  genreKey: string | undefined,
  currentId: string | undefined,
  limit: number
): Product[] {
  const related = sampleProducts.filter((product) => {
    if (currentId && product.id === currentId) {
      return false;
    }
    if (!genreKey) {
      return true;
    }
    return canonicalizeGenreKey(product.genre) === genreKey;
  });

  return sortByRank(related).slice(0, limit);
}

function mapApiProducts(items: DmmProduct[] | undefined, preserveRank = false): Product[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item, index) => {
    const product = toProduct(item, preserveRank ? index + 1 : undefined);
    return preserveRank ? product : stripRank(product);
  });
}

async function loadCatalogProducts(
  fetcher: () => Promise<DmmProduct[]>,
  fallback: Product[],
  options: CatalogLoadOptions = {},
  preserveRank = false
): Promise<Product[]> {
  const limit = normalizeLimit(options);
  const apiItems = await fetcher();
  const apiProducts = mapApiProducts(apiItems, preserveRank);

  return mergeProducts(apiProducts, fallback, limit, new Set(), preserveRank);
}

export async function loadRankingProducts(
  options: CatalogLoadOptions = {}
): Promise<Product[]> {
  const limit = normalizeLimit(options);
  const hits = options.hits ?? limit;

  return loadCatalogProducts(
    () => fetchRanking(hits, options.offset ?? 1),
    getCuratedRanking(limit),
    { limit },
    true
  );
}

export async function loadSaleProducts(
  options: CatalogLoadOptions = {}
): Promise<Product[]> {
  const limit = normalizeLimit(options);
  const hits = options.hits ?? limit;

  return loadCatalogProducts(
    () => fetchSaleProducts(hits),
    getCuratedSale(limit),
    { limit }
  );
}

export async function loadNewProducts(
  options: CatalogLoadOptions = {}
): Promise<Product[]> {
  const limit = normalizeLimit(options);
  const hits = options.hits ?? limit;

  return loadCatalogProducts(
    () => fetchNewReleases(hits, options.offset ?? 1),
    getCuratedNew(limit),
    { limit }
  );
}

export async function loadGenreProducts(
  genreId: string,
  options: CatalogLoadOptions = {}
): Promise<Product[]> {
  const limit = normalizeLimit(options);
  const hits = options.hits ?? limit;
  const genreKey = canonicalizeGenreKey(genreId);
  const articleId = options.articleId ?? genreId;

  return loadCatalogProducts(
    () => fetchByGenre(articleId, hits, options.offset ?? 1),
    getCuratedGenre(genreKey, limit),
    { limit }
  );
}

export async function loadRelatedProducts(
  options: RelatedCatalogLoadOptions = {}
): Promise<Product[]> {
  const limit = normalizeLimit(options);
  const hits = options.hits ?? limit;
  const genreKey = options.genre ? canonicalizeGenreKey(options.genre) : undefined;
  const articleId = options.articleId ?? options.genre;
  const fallback = getCuratedRelated(genreKey, options.currentId, limit);
  const excludedIds = new Set(options.currentId ? [options.currentId] : []);

  const fetcher = articleId
    ? () => fetchByGenre(articleId, hits, options.offset ?? 1)
    : () => fetchRanking(hits, options.offset ?? 1);

  const apiProducts = mapApiProducts(await fetcher(), false).filter(
    (product) => !excludedIds.has(product.id)
  );

  return mergeProducts(apiProducts, fallback, limit, excludedIds);
}
