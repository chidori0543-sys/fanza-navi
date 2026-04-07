import { getSiteConfig } from "@/lib/env";

const SITE_CONFIG = getSiteConfig();

export const SITE_URL = SITE_CONFIG.siteUrl;
export const HAS_CANONICAL_SITE_URL = SITE_CONFIG.hasCanonicalHost;

export const ROUTES = {
  home: "/",
  ranking: "/ranking",
  newReleases: "/new",
  sale: "/sale",
  genres: "/genre",
  reviews: "/reviews",
  search: "/search",
  guide: "/guide",
  compare: "/compare",
  contact: "/contact",
  terms: "/terms",
  privacy: "/privacy",
  about: "/about",
  articles: "/articles",
  articleFanzaPayment: "/articles/fanza-payment",
  articleVrSetup: "/articles/vr-setup",
  articleSaveMoney: "/articles/save-money",
} as const;

export function toAbsoluteUrl(path = "") {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function getGenreRoute(slug: string) {
  return `${ROUTES.genres}/${slug}`;
}

export function getReviewRoute(slug: string) {
  return `${ROUTES.reviews}/${slug}`;
}
