export const SITE_URL = "https://fragrant-thunder-2202.chidori0543.workers.dev";

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
