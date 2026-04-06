const DEFAULT_SITE_URL = "https://fragrant-thunder-2202.chidori0543.workers.dev";
const DEFAULT_DMM_AFFILIATE_LINK = "https://al.dmm.co.jp/";
const DEFAULT_FANZA_FLOOR = "videoa";
const DEFAULT_FANZA_DEFAULT_GENRE = "popular";

export interface SiteConfig {
  siteUrl: string;
  dmmAffiliateLink: string;
  dmmApiId: string;
  dmmAffiliateId: string;
  fanzaFloor: string;
  fanzaDefaultGenre: string;
  analyticsId: string;
  gtmId: string;
}

function readStringEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function normalizeBaseUrl(value: string, fallback: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return fallback;
  }

  try {
    const url = new URL(trimmedValue);
    const pathname = url.pathname.replace(/\/$/, "");

    return `${url.origin}${pathname}`;
  } catch {
    return fallback;
  }
}

export function getSiteConfig(): SiteConfig {
  return {
    siteUrl: normalizeBaseUrl(readStringEnv("SITE_URL"), DEFAULT_SITE_URL),
    dmmAffiliateLink: normalizeBaseUrl(
      readStringEnv("DMM_AFFILIATE_LINK"),
      DEFAULT_DMM_AFFILIATE_LINK
    ),
    dmmApiId: readStringEnv("DMM_API_ID"),
    dmmAffiliateId: readStringEnv("DMM_AFFILIATE_ID"),
    fanzaFloor: readStringEnv("FANZA_FLOOR") || DEFAULT_FANZA_FLOOR,
    fanzaDefaultGenre:
      readStringEnv("FANZA_DEFAULT_GENRE") || DEFAULT_FANZA_DEFAULT_GENRE,
    analyticsId: readStringEnv("ANALYTICS_ID"),
    gtmId: readStringEnv("GTM_ID"),
  };
}
