export interface Env {
  DB: D1Database;
  DMM_API_ID: string;
  DMM_AFFILIATE_ID: string;
  CORS_ORIGIN: string;
  SITE_URL: string;
  X_BEARER_TOKEN?: string;
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
}

interface DmmItem {
  content_id?: string;
  title?: string;
  URL?: string;
  affiliateURL?: string;
  imageURL?: {
    list?: string;
    small?: string;
    large?: string;
  };
  prices?: {
    price?: string;
    deliveries?: Array<{ type?: string; price?: string }>;
  };
  date?: string;
  review?: {
    count?: number | string;
    average?: number | string;
  };
  iteminfo?: {
    genre?: Array<{ id?: number | string; name?: string }>;
    maker?: Array<{ id?: number | string; name?: string }>;
    actress?: Array<{ id?: number | string; name?: string }>;
    label?: Array<{ id?: number | string; name?: string }>;
    series?: Array<{ id?: number | string; name?: string }>;
  };
}

interface VideoSearchContent {
  id?: string;
  title?: string;
  packageImage?: {
    mediumUrl?: string;
    largeUrl?: string;
  };
  review?: {
    average?: number | string;
    count?: number | string;
  };
  salesInfo?: {
    lowestPrice?: {
      productId?: string;
      price?: number | string;
      discountPrice?: number | string | null;
      legacyProductType?: string;
    };
    campaign?: {
      name?: string;
      endAt?: string;
    } | null;
    pointRewardCampaign?: {
      name?: string;
    } | null;
    hasMultiplePrices?: boolean;
  };
  isOnSale?: boolean;
  deliveryStartAt?: string;
  contentType?: string;
  actresses?: Array<{ id?: string; name?: string }>;
  maker?: { id?: string; name?: string } | null;
}

type SearchSort = "popular" | "price-asc" | "price-desc" | "rating" | "new";

const DMM_API_BASE = "https://api.dmm.com/affiliate/v3/ItemList";
const VIDEO_GRAPHQL_ENDPOINT = "https://api.video.dmm.co.jp/graphql";
const VIDEO_CONTENT_BASE_URL = "https://video.dmm.co.jp/av/content/";
const DMM_AFFILIATE_TRACKING_URL = "https://al.dmm.co.jp/";
const DMM_DEFAULT_OUTBOUND_URL = "https://www.dmm.co.jp/digital/videoa/";
const VIDEO_SEARCH_QUERY = `query WorkerAvSearch(
  $limit: Int!
  $offset: Int!
  $sort: ContentSearchPPVSort!
  $queryWord: String
  $filter: ContentSearchPPVFilterInput
) {
  legacySearchPPV(
    limit: $limit
    offset: $offset
    floor: AV
    sort: $sort
    queryWord: $queryWord
    filter: $filter
    facetLimit: 1
    includeExplicit: true
    excludeUndelivered: false
  ) {
    result {
      contents {
        id
        title
        packageImage {
          mediumUrl
          largeUrl
        }
        review {
          average
          count
        }
        salesInfo {
          lowestPrice {
            productId
            price
            discountPrice
            legacyProductType
          }
          campaign {
            name
            endAt
          }
          pointRewardCampaign {
            name
          }
          hasMultiplePrices
        }
        isOnSale
        deliveryStartAt
        contentType
        actresses {
          id
          name
        }
        maker {
          id
          name
        }
      }
      pageInfo {
        offset
        limit
        hasNext
        totalCount
      }
    }
  }
}`;
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
  mature: "mature",
  "熟女": "mature",
  "熟女・人妻": "mature",
  busty: "busty",
  "巨乳": "busty",
  "爆乳": "busty",
  planning: "planning",
  "企画": "planning",
  "企画もの": "planning",
  drama: "drama",
  "ドラマ": "drama",
  cosplay: "cosplay",
  "コスプレ": "cosplay",
  idol: "idol",
  "アイドル": "idol",
  "アイドル・芸能人": "idol",
};

function json(data: unknown, corsHeaders: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isAllowedOrigin(requestOrigin: string | null, env: Env) {
  const configuredOrigin = env.CORS_ORIGIN || "*";

  if (!requestOrigin || configuredOrigin === "*") {
    return true;
  }

  if (requestOrigin === configuredOrigin) {
    return true;
  }

  try {
    const configuredHost = new URL(env.SITE_URL || configuredOrigin).hostname;
    const requestHost = new URL(requestOrigin).hostname;

    return requestHost === configuredHost || requestHost.endsWith(`.${configuredHost}`);
  } catch {
    return false;
  }
}

function getCorsOrigin(request: Request, env: Env) {
  const configuredOrigin = env.CORS_ORIGIN || "*";
  const requestOrigin = request.headers.get("Origin")?.trim();

  if (!requestOrigin) {
    return configuredOrigin;
  }

  if (isAllowedOrigin(requestOrigin, env)) {
    return requestOrigin;
  }

  return configuredOrigin;
}

function validateOrigin(request: Request, env: Env, corsHeaders: Record<string, string>) {
  const requestOrigin = request.headers.get("Origin")?.trim() || null;

  if (!isAllowedOrigin(requestOrigin, env)) {
    return json({ error: "origin not allowed" }, corsHeaders, 403);
  }

  return null;
}

function clampInt(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.floor(value)));
}

function cleanText(value: unknown, maxLength: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanMultilineText(value: unknown, maxLength: number) {
  return String(value ?? "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .slice(0, maxLength);
}

async function fetchDmmJson<T>(params: URLSearchParams, context: string): Promise<T> {
  const response = await fetch(`${DMM_API_BASE}?${params.toString()}`);

  if (!response.ok) {
    const body = await response.text();
    console.error(`[dmm:${context}] ${response.status} ${body}`);
    throw new Error(`DMM API error: ${response.status}${body ? ` - ${body.slice(0, 240)}` : ""}`);
  }

  return (await response.json()) as T;
}

async function fetchVideoSearchJson<T>(
  body: Record<string, unknown>,
  context: string
): Promise<T> {
  const response = await fetch(VIDEO_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://video.dmm.co.jp",
      Referer: "https://video.dmm.co.jp/av/list/",
      "User-Agent": "Mozilla/5.0 (compatible; FANZA Tokunavi Worker/1.0)",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[video-search:${context}] ${response.status} ${text}`);
    throw new Error(`Video search error: ${response.status}${text ? ` - ${text.slice(0, 240)}` : ""}`);
  }

  const data = (await response.json()) as { errors?: Array<{ message?: string }> } & T;

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const message = data.errors.map((entry) => entry.message || "unknown").join(" / ");
    console.error(`[video-search:${context}] graphql errors: ${message}`);
    throw new Error(`Video search graphql error: ${message}`);
  }

  return data;
}

function normalizeImageUrl(url?: string): string {
  const value = url?.trim();

  if (!value) {
    return "";
  }

  try {
    const parsed = new URL(value.startsWith("//") ? `https:${value}` : value);

    if (parsed.hostname === "awsimgsrc.dmm.co.jp" && parsed.pathname.startsWith("/pics_dig/")) {
      return `https://pics.dmm.co.jp${parsed.pathname.replace(/^\/pics_dig/, "")}${parsed.search}`;
    }

    return parsed.toString().replace(/^http:\/\//i, "https://");
  } catch {
    // Fall through to the legacy normalization below.
  }

  if (value.startsWith("//")) {
    return `https:${value}`;
  }

  return value.replace(/^http:\/\//i, "https://");
}

function isAllowedOutboundHost(hostname: string) {
  return (
    hostname === "dmm.co.jp" ||
    hostname.endsWith(".dmm.co.jp") ||
    hostname === "fanza.com" ||
    hostname.endsWith(".fanza.com")
  );
}

function normalizeAffiliateTarget(target: string = "") {
  const trimmedTarget = target.trim();

  if (!trimmedTarget) {
    return DMM_DEFAULT_OUTBOUND_URL;
  }

  try {
    const parsed = new URL(trimmedTarget);

    if ((parsed.protocol !== "http:" && parsed.protocol !== "https:") || !isAllowedOutboundHost(parsed.hostname)) {
      return DMM_DEFAULT_OUTBOUND_URL;
    }

    return parsed.toString();
  } catch {
    return DMM_DEFAULT_OUTBOUND_URL;
  }
}

function buildAffiliateUrl(target: string, affiliateId?: string) {
  const normalizedTarget = normalizeAffiliateTarget(target);

  if (!affiliateId) {
    return normalizedTarget;
  }

  const params = new URLSearchParams({
    lurl: normalizedTarget,
    af_id: affiliateId,
  });

  return `${DMM_AFFILIATE_TRACKING_URL}?${params.toString()}`;
}

function buildVideoContentUrl(contentId: string, rank?: number) {
  const url = new URL(VIDEO_CONTENT_BASE_URL);
  url.searchParams.set("id", contentId);

  if (rank && rank > 0) {
    url.searchParams.set("i3_ref", "search");
    url.searchParams.set("i3_ord", String(rank));
    url.searchParams.set("i3_pst", "1");
    url.searchParams.set("dmmref", "video_search");
  }

  return url.toString();
}

function mapGenreLabelToKey(label?: string): string {
  const normalized = label?.trim() ?? "";

  if (!normalized) {
    return "popular";
  }

  return (
    CANONICAL_GENRE_ALIASES[normalized] ||
    CANONICAL_GENRE_ALIASES[normalized.toLowerCase()] ||
    normalized
  );
}

function inferSearchGenre(product: {
  title: string;
  contentType?: string;
  isSale: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
}) {
  const haystack = product.title;

  if (product.contentType === "VR" || /\bVR\b/i.test(haystack)) {
    return "vr";
  }
  if (/素人/u.test(haystack)) {
    return "amateur";
  }
  if (/熟女|人妻/u.test(haystack)) {
    return "mature";
  }
  if (/巨乳|爆乳|[GHIJKLＭN]カップ/u.test(haystack)) {
    return "busty";
  }
  if (/コスプレ|制服|ランジェリー/u.test(haystack)) {
    return "cosplay";
  }
  if (/アイドル|芸能人|グラビア/u.test(haystack)) {
    return "idol";
  }
  if (/企画|モニタリング|検証|ナンパ|ドキュメント/u.test(haystack)) {
    return "planning";
  }
  if (/ドラマ|寝取られ|NTR|物語|義母|純愛/u.test(haystack)) {
    return "drama";
  }
  if (product.isNew) {
    return "new-release";
  }
  if (product.isSale) {
    return "sale";
  }
  if (product.rating >= 4.5 && product.reviewCount >= 20) {
    return "high-rated";
  }

  return "popular";
}

function buildSearchTags(options: {
  title: string;
  contentType?: string;
  maker: string;
  actresses: string[];
  isSale: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  campaignName?: string;
}) {
  const tags: string[] = [];
  const genreKey = inferSearchGenre(options);

  if (genreKey === "vr") tags.push("VR");
  if (genreKey === "amateur") tags.push("素人");
  if (genreKey === "mature") tags.push("熟女");
  if (genreKey === "busty") tags.push("巨乳");
  if (genreKey === "cosplay") tags.push("コスプレ");
  if (genreKey === "idol") tags.push("アイドル");
  if (genreKey === "planning") tags.push("企画");
  if (genreKey === "drama") tags.push("ドラマ");
  if (options.isNew) tags.push("新作");
  if (options.isSale) tags.push("セール");
  if (options.rating >= 4.5 && options.reviewCount >= 20) tags.push("高評価");
  if (options.campaignName) tags.push(cleanText(options.campaignName, 24));
  if (options.actresses[0]) tags.push(cleanText(options.actresses[0], 24));
  if (options.maker) tags.push(cleanText(options.maker, 24));

  return Array.from(new Set(tags.filter(Boolean))).slice(0, 4);
}

function parsePrice(prices: Record<string, unknown> | undefined): number {
  if (!prices) return 0;
  if (typeof prices.price === "string") {
    return parseInt(prices.price.replace(/[^0-9]/g, ""), 10) || 0;
  }
  const deliveries = prices.deliveries as Array<{ price?: string }> | undefined;
  if (deliveries?.[0]?.price) {
    return parseInt(deliveries[0].price.replace(/[^0-9]/g, ""), 10) || 0;
  }
  return 0;
}

function parseSalePrice(item: Record<string, unknown>): number | null {
  const title = item.title as string | undefined;
  const match = title?.match(/(\d+)%\s*OFF/i);
  if (match) {
    const pct = parseInt(match[1], 10);
    const price = parsePrice(item.prices as Record<string, unknown> | undefined);
    if (price > 0) return Math.round(price * (1 - pct / 100));
  }
  return null;
}

function extractDiscount(title: string): number {
  const match = title?.match(/(\d+)%\s*OFF/i);
  return match ? parseInt(match[1], 10) : 0;
}

function isNewRelease(dateStr?: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff < 7 * 24 * 60 * 60 * 1000;
}

function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => cleanText(entry, 24))
        .filter(Boolean)
    )
  ).slice(0, 4);
}

async function hashString(str: string): Promise<string> {
  const encoded = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

async function getRequesterHash(request: Request) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const ua = request.headers.get("User-Agent") || "unknown";
  return hashString(`${ip}:${ua}`);
}

function toSearchProduct(item: DmmItem, rank?: number) {
  const rawPrice = parsePrice(item.prices as Record<string, unknown> | undefined);
  const genres = item.iteminfo?.genre?.map((genre) => genre.name || "").filter(Boolean) || [];
  const genreKey = mapGenreLabelToKey(genres[0]);
  const rating = Number(item.review?.average ?? 0) || 0;
  const reviewCount = Number(item.review?.count ?? 0) || 0;
  const actresses = item.iteminfo?.actress?.map((entry) => entry.name || "").filter(Boolean) || [];
  const maker = item.iteminfo?.maker?.[0]?.name || "";
  const label = item.iteminfo?.label?.[0]?.name || "";
  const series = item.iteminfo?.series?.[0]?.name || label;
  const discount = extractDiscount(item.title || "");
  const isSale = discount > 0;

  let price = rawPrice;
  let salePrice: number | undefined;

  if (discount > 0 && rawPrice > 0) {
    salePrice = rawPrice;
    price = Math.round(rawPrice / (1 - discount / 100));
  }

  return {
    id: item.content_id || "",
    title: item.title || "",
    description: genres.join(" / ") || "FANZA作品",
    imageUrl: normalizeImageUrl(item.imageURL?.large || item.imageURL?.small || item.imageURL?.list),
    affiliateUrl: cleanText(item.affiliateURL || item.URL || "", 500),
    price,
    salePrice,
    rating,
    reviewCount,
    genre: genreKey,
    tags: genres.slice(0, 4),
    maker,
    label,
    series,
    actresses,
    rank,
    isNew: isNewRelease(item.date),
    isSale,
    releaseDate: item.date || "",
  };
}

function toVideoSearchProduct(item: VideoSearchContent, affiliateId?: string, rank?: number) {
  const actresses = item.actresses?.map((entry) => entry.name || "").filter(Boolean) || [];
  const maker = item.maker?.name || "";
  const priceInfo = item.salesInfo?.lowestPrice;
  const basePrice = Number(priceInfo?.price ?? 0) || 0;
  const discountPrice = Number(priceInfo?.discountPrice ?? 0) || 0;
  const price = basePrice > 0 ? basePrice : discountPrice;
  const salePrice = discountPrice > 0 ? discountPrice : undefined;
  const rating = Number(item.review?.average ?? 0) || 0;
  const reviewCount = Number(item.review?.count ?? 0) || 0;
  const isSale = Boolean(item.isOnSale || discountPrice > 0);
  const releaseDate = item.deliveryStartAt || "";
  const isNew = isNewRelease(releaseDate);
  const title = cleanText(item.title, 240);
  const genre = inferSearchGenre({
    title,
    contentType: item.contentType,
    isSale,
    isNew,
    rating,
    reviewCount,
  });
  const campaignName = item.salesInfo?.campaign?.name || item.salesInfo?.pointRewardCampaign?.name || "";
  const tags = buildSearchTags({
    title,
    contentType: item.contentType,
    maker,
    actresses,
    isSale,
    isNew,
    rating,
    reviewCount,
    campaignName,
  });
  const description = [genre === "vr" ? "VR作品" : "", campaignName, maker, actresses[0] || ""]
    .filter(Boolean)
    .join(" / ");

  return {
    id: cleanText(item.id, 64),
    title,
    description: description || "FANZA作品",
    imageUrl: normalizeImageUrl(item.packageImage?.largeUrl || item.packageImage?.mediumUrl),
    affiliateUrl: buildAffiliateUrl(buildVideoContentUrl(cleanText(item.id, 64), rank), affiliateId),
    price,
    salePrice,
    rating,
    reviewCount,
    genre,
    tags,
    maker,
    label: "",
    series: "",
    actresses,
    rank,
    isNew,
    isSale,
    releaseDate,
  };
}

function mapSearchSortToDmm(sort: SearchSort) {
  switch (sort) {
    case "new":
      return "date";
    case "price-asc":
      return "price";
    case "price-desc":
      return "-price";
    case "rating":
      return "review";
    case "popular":
    default:
      return "rank";
  }
}

function mapSearchSortToVideo(sort: SearchSort) {
  switch (sort) {
    case "new":
      return "DELIVERY_START_DATE";
    case "price-asc":
    case "price-desc":
      return "LOWEST_PRICE";
    case "rating":
      return "REVIEW_RANK_SCORE";
    case "popular":
    default:
      return "SALES_RANK_SCORE";
  }
}

async function fetchDmmBatch(
  env: Env,
  options: {
    keyword?: string;
    genre?: string;
    sort: SearchSort;
    hits: number;
    offset: number;
  }
) {
  const params = new URLSearchParams({
    api_id: env.DMM_API_ID,
    affiliate_id: env.DMM_AFFILIATE_ID,
    site: "FANZA",
    service: "digital",
    floor: "videoa",
    output: "json",
    hits: String(options.hits),
    offset: String(options.offset),
    sort: mapSearchSortToDmm(options.sort),
  });

  if (options.keyword) {
    params.set("keyword", options.keyword);
  }

  if (options.genre) {
    params.set("article", "genre");
    params.set("article_id", options.genre);
  }

  const data = await fetchDmmJson<{
    result?: {
      items?: DmmItem[];
      total_count?: number;
    };
  }>(params, "catalog-search");

  return {
    items: data.result?.items ?? [],
    totalCount: typeof data.result?.total_count === "number" ? data.result.total_count : null,
  };
}

async function fetchVideoSearchBatch(
  env: Env,
  options: {
    keyword?: string;
    sort: SearchSort;
    hits: number;
    offset: number;
    saleOnly: boolean;
  }
) {
  const data = await fetchVideoSearchJson<{
    data?: {
      legacySearchPPV?: {
        result?: {
          contents?: VideoSearchContent[];
          pageInfo?: {
            offset?: number;
            limit?: number;
            hasNext?: boolean;
            totalCount?: number;
          };
        };
      };
    };
  }>(
    {
      operationName: "WorkerAvSearch",
      query: VIDEO_SEARCH_QUERY,
      variables: {
        limit: clampInt(options.hits, 1, 120, 120),
        offset: Math.max(0, Math.floor(options.offset)),
        sort: mapSearchSortToVideo(options.sort),
        queryWord: options.keyword || null,
        filter: {
          isSaleItemsOnly: options.saleOnly,
        },
      },
    },
    "catalog-search"
  );

  const result = data.data?.legacySearchPPV?.result;
  const items = result?.contents ?? [];
  const safeOffset = Math.max(0, Math.floor(result?.pageInfo?.offset ?? options.offset));

  return {
    items: items.map((item, index) => toVideoSearchProduct(item, env.DMM_AFFILIATE_ID, safeOffset + index + 1)),
    totalCount:
      typeof result?.pageInfo?.totalCount === "number" ? result.pageInfo.totalCount : null,
    hasNext: Boolean(result?.pageInfo?.hasNext),
  };
}

function matchesGenreFilter(
  product: ReturnType<typeof toSearchProduct> | ReturnType<typeof toVideoSearchProduct>,
  genre?: string
) {
  if (!genre) {
    return true;
  }

  const haystack = [
    product.genre,
    product.title,
    product.description,
    product.maker || "",
    product.label || "",
    product.series || "",
    ...product.tags,
    ...(product.actresses || []),
  ].join(" ");

  switch (genre) {
    case "popular":
      return true;
    case "sale":
      return Boolean(product.isSale);
    case "new-release":
      return Boolean(product.isNew);
    case "high-rated":
      return product.rating >= 4.5;
    case "vr":
      return /\bVR\b/i.test(haystack);
    case "amateur":
      return /素人/u.test(haystack);
    case "mature":
      return /熟女|人妻/u.test(haystack);
    case "busty":
      return /巨乳|爆乳|[GHIJKLＭN]カップ/u.test(haystack);
    case "planning":
      return /企画|モニタリング|検証|ナンパ|ドキュメント/u.test(haystack);
    case "drama":
      return /ドラマ|寝取られ|NTR|物語|義母|純愛/u.test(haystack);
    case "cosplay":
      return /コスプレ|制服|ランジェリー/u.test(haystack);
    case "idol":
      return /アイドル|芸能人|グラビア/u.test(haystack);
    default:
      return product.genre === genre;
  }
}

function matchesSearchFilters(
  product: ReturnType<typeof toSearchProduct>,
  filters: {
    genre?: string;
    saleOnly: boolean;
    minPrice: number;
    maxPrice: number | null;
    minRating: number;
    minReviewCount: number;
  }
) {
  const effectivePrice = product.salePrice ?? product.price;

  if (!matchesGenreFilter(product, filters.genre)) {
    return false;
  }
  if (filters.saleOnly && !product.isSale) {
    return false;
  }
  if (effectivePrice < filters.minPrice) {
    return false;
  }
  if (filters.maxPrice !== null && effectivePrice > filters.maxPrice) {
    return false;
  }
  if (product.rating < filters.minRating) {
    return false;
  }
  if (product.reviewCount < filters.minReviewCount) {
    return false;
  }

  return Boolean(product.id && product.title && product.affiliateUrl);
}

// ─── Price Tracker ──────────────────────────────────────────────────────────

async function recordPrices(env: Env) {
  const params = new URLSearchParams({
    api_id: env.DMM_API_ID,
    affiliate_id: env.DMM_AFFILIATE_ID,
    site: "FANZA",
    service: "digital",
    floor: "videoa",
    hits: "100",
    sort: "rank",
    output: "json",
  });

  const data = await fetchDmmJson<{
    result?: {
      items?: Array<Record<string, unknown>>;
    };
  }>(params, "price-tracker");

  if (data?.result?.items) {
    const statement = env.DB.prepare(
      "INSERT OR IGNORE INTO price_history (content_id, title, price, sale_price, discount_pct, recorded_at) VALUES (?, ?, ?, ?, ?, ?)"
    );
    const now = new Date().toISOString().split("T")[0];
    const batch = data.result.items.map((item) => {
      const price = parsePrice(item.prices as Record<string, unknown> | undefined);
      const salePrice = parseSalePrice(item);
      const discountPct = salePrice ? Math.round((1 - salePrice / price) * 100) : 0;
      return statement.bind(
        item.content_id as string,
        item.title as string,
        price,
        salePrice,
        discountPct,
        now
      );
    });
    await env.DB.batch(batch);
  }
}

async function handlePriceHistory(url: URL, env: Env, headers: Record<string, string>) {
  const contentId = url.searchParams.get("content_id");
  if (!contentId) return json({ error: "content_id required" }, headers, 400);

  const history = await env.DB.prepare(
    "SELECT price, sale_price, discount_pct, recorded_at FROM price_history WHERE content_id = ? ORDER BY recorded_at ASC LIMIT 90"
  )
    .bind(contentId)
    .all();

  return json({ content_id: contentId, history: history.results }, headers);
}

// ─── Shared Reviews ─────────────────────────────────────────────────────────

function formatReviewRow(row: Record<string, unknown>) {
  return {
    id: String(row.id ?? ""),
    productId: String(row.product_id ?? ""),
    productTitle: String(row.product_title ?? ""),
    productImageUrl: String(row.product_image_url ?? ""),
    productAffiliateUrl: String(row.product_affiliate_url ?? ""),
    rating: Number(row.rating ?? 0) || 0,
    title: String(row.title ?? ""),
    body: String(row.body ?? ""),
    tags: parseTags(JSON.parse(String(row.tags ?? "[]"))),
    createdAt: String(row.created_at ?? ""),
    helpfulCount: Number(row.helpful_count ?? 0) || 0,
    helpfulByMe: Boolean(Number(row.helpful_by_me ?? 0)),
    isOwn: Boolean(Number(row.is_own ?? 0)),
  };
}

async function handleReviewList(request: Request, url: URL, env: Env, headers: Record<string, string>) {
  const viewerHash = await getRequesterHash(request);
  const query = cleanText(url.searchParams.get("query"), 80).toLowerCase();
  const ratingMin = clampInt(parseInt(url.searchParams.get("rating_min") || "0", 10), 0, 5, 0);
  const page = clampInt(parseInt(url.searchParams.get("page") || "1", 10), 1, 50, 1);
  const pageSize = clampInt(parseInt(url.searchParams.get("page_size") || "12", 10), 6, 24, 12);
  const offset = (page - 1) * pageSize;
  const likeQuery = `%${query}%`;

  const whereClause = query
    ? "WHERE r.rating >= ? AND (lower(r.title) LIKE ? OR lower(r.body) LIKE ? OR lower(r.product_title) LIKE ? OR lower(r.tags) LIKE ?)"
    : "WHERE r.rating >= ?";
  const whereBindings = query
    ? [ratingMin, likeQuery, likeQuery, likeQuery, likeQuery]
    : [ratingMin];

  const totalRow = await env.DB.prepare(
    `SELECT COUNT(*) AS total
     FROM reviews r
     ${whereClause}`
  )
    .bind(...whereBindings)
    .first<Record<string, unknown>>();

  const rows = await env.DB.prepare(
    `SELECT
        r.id,
        r.product_id,
        r.product_title,
        r.product_image_url,
        r.product_affiliate_url,
        r.rating,
        r.title,
        r.body,
        r.tags,
        r.created_at,
        (SELECT COUNT(*) FROM review_helpful_votes hv WHERE hv.review_id = r.id) AS helpful_count,
        EXISTS(SELECT 1 FROM review_helpful_votes hv WHERE hv.review_id = r.id AND hv.voter_hash = ?) AS helpful_by_me,
        CASE WHEN r.author_hash = ? THEN 1 ELSE 0 END AS is_own
      FROM reviews r
      ${whereClause}
      ORDER BY datetime(r.created_at) DESC
      LIMIT ? OFFSET ?`
  )
    .bind(viewerHash, viewerHash, ...whereBindings, pageSize, offset)
    .all<Record<string, unknown>>();

  const total = Number(totalRow?.total ?? 0) || 0;

  return json(
    {
      reviews: rows.results.map(formatReviewRow),
      total,
      page,
      pageSize,
      hasMore: offset + rows.results.length < total,
      source: "remote",
    },
    headers
  );
}

async function handleReviewCreate(request: Request, env: Env, headers: Record<string, string>) {
  const body = (await request.json()) as Record<string, unknown>;
  const productId = cleanText(body.productId, 64);
  const productTitle = cleanText(body.productTitle, 140);
  const productImageUrl = normalizeImageUrl(cleanText(body.productImageUrl, 500));
  const productAffiliateUrl = cleanText(body.productAffiliateUrl, 500);
  const rating = clampInt(Number(body.rating), 1, 5, 0);
  const title = cleanText(body.title, 60);
  const reviewBody = cleanMultilineText(body.body, 800);
  const tags = parseTags(body.tags);

  if (!productId || !productTitle || !title || !reviewBody || rating < 1) {
    return json({ error: "invalid review payload" }, headers, 400);
  }

  const id = crypto.randomUUID();
  const authorHash = await getRequesterHash(request);
  const createdAt = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO reviews (
      id, product_id, product_title, product_image_url, product_affiliate_url,
      rating, title, body, tags, author_hash, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      productId,
      productTitle,
      productImageUrl,
      productAffiliateUrl,
      rating,
      title,
      reviewBody,
      JSON.stringify(tags),
      authorHash,
      createdAt
    )
    .run();

  return json(
    {
      ok: true,
      review: {
        id,
        productId,
        productTitle,
        productImageUrl,
        productAffiliateUrl,
        rating,
        title,
        body: reviewBody,
        tags,
        createdAt,
        helpfulCount: 0,
        helpfulByMe: false,
        isOwn: true,
      },
    },
    headers
  );
}

async function handleReviewHelpful(request: Request, env: Env, headers: Record<string, string>) {
  const body = (await request.json()) as Record<string, unknown>;
  const reviewId = cleanText(body.review_id, 64);

  if (!reviewId) {
    return json({ error: "review_id required" }, headers, 400);
  }

  const voterHash = await getRequesterHash(request);
  const existing = await env.DB.prepare(
    "SELECT id FROM review_helpful_votes WHERE review_id = ? AND voter_hash = ?"
  )
    .bind(reviewId, voterHash)
    .first();

  let helpful = false;

  if (existing) {
    await env.DB.prepare("DELETE FROM review_helpful_votes WHERE review_id = ? AND voter_hash = ?")
      .bind(reviewId, voterHash)
      .run();
  } else {
    await env.DB.prepare("INSERT INTO review_helpful_votes (review_id, voter_hash) VALUES (?, ?)")
      .bind(reviewId, voterHash)
      .run();
    helpful = true;
  }

  const countRow = await env.DB.prepare(
    "SELECT COUNT(*) AS total FROM review_helpful_votes WHERE review_id = ?"
  )
    .bind(reviewId)
    .first<Record<string, unknown>>();

  return json(
    {
      ok: true,
      reviewId,
      helpful,
      helpfulCount: Number(countRow?.total ?? 0) || 0,
    },
    headers
  );
}

async function handleReviewDelete(request: Request, env: Env, headers: Record<string, string>) {
  const body = (await request.json()) as Record<string, unknown>;
  const reviewId = cleanText(body.review_id, 64);

  if (!reviewId) {
    return json({ error: "review_id required" }, headers, 400);
  }

  const authorHash = await getRequesterHash(request);
  const ownReview = await env.DB.prepare(
    "SELECT id FROM reviews WHERE id = ? AND author_hash = ?"
  )
    .bind(reviewId, authorHash)
    .first();

  if (!ownReview) {
    return json({ ok: true, deleted: false }, headers);
  }

  await env.DB.prepare("DELETE FROM review_helpful_votes WHERE review_id = ?")
    .bind(reviewId)
    .run();
  await env.DB.prepare("DELETE FROM reviews WHERE id = ? AND author_hash = ?")
    .bind(reviewId, authorHash)
    .run();

  return json({ ok: true, deleted: true }, headers);
}

// ─── Contact Form ────────────────────────────────────────────────────────────

async function handleContactCreate(request: Request, env: Env, headers: Record<string, string>) {
  const body = (await request.json()) as Record<string, unknown>;
  const name = cleanText(body.name, 80);
  const email = cleanText(body.email, 160).toLowerCase();
  const subject = cleanText(body.subject, 120);
  const message = cleanMultilineText(body.message, 4000);

  if (!subject || !message) {
    return json({ error: "subject and message are required" }, headers, 400);
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "invalid email address" }, headers, 400);
  }

  const id = crypto.randomUUID();
  const requesterHash = await getRequesterHash(request);
  const createdAt = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO contact_messages (
      id, name, email, subject, message, requester_hash, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'new', ?)`
  )
    .bind(id, name, email, subject, message, requesterHash, createdAt)
    .run();

  return json({ ok: true, id, createdAt }, headers);
}

// ─── Catalog Search ─────────────────────────────────────────────────────────

async function handleCatalogSearch(url: URL, env: Env, headers: Record<string, string>) {
  const keyword = cleanText(url.searchParams.get("keyword"), 120);
  const genre = cleanText(url.searchParams.get("genre"), 48);
  const sort = (url.searchParams.get("sort") as SearchSort | null) || "popular";
  const page = clampInt(parseInt(url.searchParams.get("page") || "1", 10), 1, 40, 1);
  const pageSize = clampInt(parseInt(url.searchParams.get("page_size") || "24", 10), 12, 36, 24);
  const saleOnly = url.searchParams.get("sale_only") === "1";
  const minPrice = clampInt(parseInt(url.searchParams.get("min_price") || "0", 10), 0, 100000, 0);
  const maxPriceValue = parseInt(url.searchParams.get("max_price") || "", 10);
  const maxPrice =
    Number.isFinite(maxPriceValue) && maxPriceValue > 0
      ? clampInt(maxPriceValue, 1, 100000, 100000)
      : null;
  const minRating = Math.min(Math.max(Number(url.searchParams.get("min_rating") || "0") || 0, 0), 5);
  const minReviewCount = clampInt(
    parseInt(url.searchParams.get("min_review_count") || "0", 10),
    0,
    50000,
    0
  );

  const hasPostFilters =
    Boolean(genre) || minPrice > 0 || maxPrice !== null || minRating > 0 || minReviewCount > 0;

  const filters = {
    genre: genre || undefined,
    saleOnly,
    minPrice,
    maxPrice,
    minRating,
    minReviewCount,
  };

  try {
    const requiredCount = page * pageSize;
    const seenIds = new Set<string>();
    const collected: Array<ReturnType<typeof toSearchProduct>> = [];
    const batchSize = 120;
    const maxBatches = keyword ? 8 : 12;
    let offset = 0;
    let scannedCount = 0;
    let totalCount: number | null = null;
    let exhausted = false;

    if (sort === "price-desc") {
      const probe = await fetchVideoSearchBatch(env, {
        keyword: keyword || undefined,
        sort,
        hits: 1,
        offset: 0,
        saleOnly,
      });

      totalCount = probe.totalCount;

      if (!totalCount || totalCount <= 0) {
        exhausted = true;
      } else {
        let nextEnd = totalCount;

        for (let batchIndex = 0; batchIndex < maxBatches; batchIndex += 1) {
          const currentOffset = Math.max(0, nextEnd - batchSize);
          const currentHits = Math.min(batchSize, nextEnd - currentOffset);
          const batch = await fetchVideoSearchBatch(env, {
            keyword: keyword || undefined,
            sort,
            hits: currentHits,
            offset: currentOffset,
            saleOnly,
          });

          scannedCount += batch.items.length;

          if (batch.items.length === 0) {
            exhausted = true;
            break;
          }

          [...batch.items].reverse().forEach((product) => {
            if (!product.id || seenIds.has(product.id)) {
              return;
            }
            if (!matchesSearchFilters(product, filters)) {
              return;
            }

            seenIds.add(product.id);
            collected.push(product);
          });

          if (collected.length >= requiredCount + pageSize) {
            break;
          }
          if (currentOffset === 0) {
            exhausted = true;
            break;
          }

          nextEnd = currentOffset;
        }
      }
    } else {
      for (let batchIndex = 0; batchIndex < maxBatches; batchIndex += 1) {
        const batch = await fetchVideoSearchBatch(env, {
          keyword: keyword || undefined,
          sort,
          hits: batchSize,
          offset,
          saleOnly,
        });

        totalCount = batch.totalCount;
        scannedCount += batch.items.length;

        if (batch.items.length === 0) {
          exhausted = true;
          break;
        }

        batch.items.forEach((product) => {
          if (!product.id || seenIds.has(product.id)) {
            return;
          }
          if (!matchesSearchFilters(product, filters)) {
            return;
          }

          seenIds.add(product.id);
          collected.push(product);
        });

        if (collected.length >= requiredCount + pageSize) {
          break;
        }
        if (!batch.hasNext) {
          exhausted = true;
          break;
        }

        offset += batchSize;
      }
    }

    const start = (page - 1) * pageSize;
    const items = collected.slice(start, start + pageSize);

    return json(
      {
        items,
        total: hasPostFilters ? null : totalCount,
        page,
        pageSize,
        hasMore: !exhausted || collected.length > start + pageSize,
        scannedCount,
        source: "remote",
      },
      headers
    );
  } catch (error) {
    console.error("[catalog-search] remote search failed", error);
    return json({ error: "catalog search unavailable" }, headers, 502);
  }
}

async function getCatalogSearchReady(env: Env) {
  try {
    const batch = await fetchVideoSearchBatch(env, {
      sort: "popular",
      hits: 1,
      offset: 0,
      saleOnly: false,
    });
    return batch.items.length > 0 || (batch.totalCount ?? 0) >= 0;
  } catch (error) {
    console.error("[health] catalog readiness failed", error);
    return false;
  }
}

// ─── Sale Alert Bot ─────────────────────────────────────────────────────────

async function postTweet(env: Env, text: string) {
  await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.X_BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
}

function formatTweet(item: Record<string, unknown>): string {
  const discount = extractDiscount(item.title as string);
  const cleanTitle = (item.title as string).replace(/【.*?】/g, "").trim().slice(0, 60);
  return `🔥 ${discount}%OFF セール中！\n\n${cleanTitle}\n\n👉 ${item.affiliateURL as string}\n\n#FANZA #セール #FANZAトクナビ`;
}

async function checkSaleAlerts(env: Env) {
  if (!env.X_BEARER_TOKEN) return;

  const params = new URLSearchParams({
    api_id: env.DMM_API_ID,
    affiliate_id: env.DMM_AFFILIATE_ID,
    site: "FANZA",
    service: "digital",
    floor: "videoa",
    hits: "50",
    sort: "rank",
    keyword: "セール",
    output: "json",
  });

  const data = await fetchDmmJson<{
    result?: {
      items?: Array<Record<string, unknown>>;
    };
  }>(params, "sale-alerts");

  if (!data?.result?.items) return;

  const today = new Date().toISOString().split("T")[0];
  const topDeals = data.result.items
    .filter((item) => extractDiscount(item.title as string) >= 30)
    .slice(0, 5);

  for (const item of topDeals) {
    const existing = await env.DB.prepare(
      "SELECT id FROM sale_alerts WHERE content_id = ? AND alerted_at = ?"
    )
      .bind(item.content_id as string, today)
      .first();

    if (!existing) {
      await env.DB.prepare(
        "INSERT OR IGNORE INTO sale_alerts (content_id, title, discount_pct, alerted_at) VALUES (?, ?, ?, ?)"
      )
        .bind(
          item.content_id as string,
          item.title as string,
          extractDiscount(item.title as string),
          today
        )
        .run();

      if (env.X_BEARER_TOKEN) {
        await postTweet(env, formatTweet(item));
      }
    }
  }
}

// ─── Push Notification Subscribe ────────────────────────────────────────────

interface PushSubscribeBody {
  subscription: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };
  favorites?: string[];
}

async function handlePushSubscribe(request: Request, env: Env, headers: Record<string, string>) {
  const body = (await request.json()) as PushSubscribeBody;

  await env.DB.prepare(
    "INSERT OR REPLACE INTO push_subscriptions (endpoint, p256dh, auth, favorites) VALUES (?, ?, ?, ?)"
  )
    .bind(
      body.subscription.endpoint,
      body.subscription.keys.p256dh,
      body.subscription.keys.auth,
      JSON.stringify(body.favorites || [])
    )
    .run();

  return json({ ok: true }, headers);
}

// ─── Voting System ──────────────────────────────────────────────────────────

interface VoteBody {
  content_id: string;
  title: string;
  image_url?: string;
}

async function handleVote(request: Request, env: Env, headers: Record<string, string>) {
  const body = (await request.json()) as VoteBody;
  const voterHash = await getRequesterHash(request);

  try {
    await env.DB.prepare(
      "INSERT INTO votes (content_id, title, image_url, voter_hash) VALUES (?, ?, ?, ?)"
    )
      .bind(body.content_id, body.title, body.image_url || "", voterHash)
      .run();
    return json({ ok: true, voted: true }, headers);
  } catch {
    return json({ ok: true, voted: false, message: "Already voted" }, headers);
  }
}

async function handleVoteRanking(url: URL, env: Env, headers: Record<string, string>) {
  const period = url.searchParams.get("period") || "month";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 50);

  let dateFilter = "";
  if (period === "week") {
    dateFilter = "AND voted_at >= date('now', '-7 days')";
  } else if (period === "month") {
    dateFilter = "AND voted_at >= date('now', '-30 days')";
  }

  const ranking = await env.DB.prepare(
    `SELECT content_id, title, image_url, COUNT(*) as vote_count
     FROM votes
     WHERE 1=1 ${dateFilter}
     GROUP BY content_id
     ORDER BY vote_count DESC
     LIMIT ?`
  )
    .bind(limit)
    .all();

  return json({ period, ranking: ranking.results }, headers);
}

// ─── Worker Entry Point ─────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders: Record<string, string> = {
      "Access-Control-Allow-Origin": getCorsOrigin(request, env),
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "GET") {
      const blocked = validateOrigin(request, env, corsHeaders);
      if (blocked) {
        return blocked;
      }
    }

    try {
      if (url.pathname === "/api/price-history" && request.method === "GET") {
        return handlePriceHistory(url, env, corsHeaders);
      }
      if (url.pathname === "/api/search" && request.method === "GET") {
        return handleCatalogSearch(url, env, corsHeaders);
      }
      if (url.pathname === "/api/reviews" && request.method === "GET") {
        return handleReviewList(request, url, env, corsHeaders);
      }
      if (url.pathname === "/api/reviews" && request.method === "POST") {
        return handleReviewCreate(request, env, corsHeaders);
      }
      if (url.pathname === "/api/reviews/helpful" && request.method === "POST") {
        return handleReviewHelpful(request, env, corsHeaders);
      }
      if (url.pathname === "/api/reviews/delete" && request.method === "POST") {
        return handleReviewDelete(request, env, corsHeaders);
      }
      if (url.pathname === "/api/contact" && request.method === "POST") {
        return handleContactCreate(request, env, corsHeaders);
      }
      if (url.pathname === "/api/push/subscribe" && request.method === "POST") {
        return handlePushSubscribe(request, env, corsHeaders);
      }
      if (url.pathname === "/api/vote" && request.method === "POST") {
        return handleVote(request, env, corsHeaders);
      }
      if (url.pathname === "/api/vote/ranking" && request.method === "GET") {
        return handleVoteRanking(url, env, corsHeaders);
      }
      if (url.pathname === "/api/health") {
        const includeCatalog = url.searchParams.get("include_catalog") === "1";
        const catalogSearchReady = includeCatalog ? await getCatalogSearchReady(env) : undefined;
        return json(
          {
            status: "ok",
            timestamp: new Date().toISOString(),
            catalogSearchReady,
          },
          corsHeaders
        );
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error("[worker] request failed", error);
      return json({ error: "Internal Server Error" }, corsHeaders, 500);
    }
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(Promise.all([recordPrices(env), checkSaleAlerts(env)]));
  },
};
