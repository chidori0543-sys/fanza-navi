const DMM_AFFILIATE_TRACKING_URL = "https://al.dmm.co.jp/";
const DMM_DEFAULT_OUTBOUND_URL = "https://www.dmm.co.jp/digital/videoa/";

function getAffiliateId(): string {
  return process.env.DMM_AFFILIATE_ID?.trim() ?? "";
}

function isAbsoluteUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function normalizeOutboundTarget(target: string = ""): string {
  const trimmedTarget = target.trim();

  if (!trimmedTarget) {
    return DMM_DEFAULT_OUTBOUND_URL;
  }

  if (isAbsoluteUrl(trimmedTarget)) {
    return trimmedTarget;
  }

  return `${DMM_DEFAULT_OUTBOUND_URL}-/list/=/article=keyword/keyword=${encodeURIComponent(
    trimmedTarget
  )}/`;
}

export function buildAffiliateUrl(destinationUrl: string): string {
  const affiliateId = getAffiliateId();
  const normalizedDestination = normalizeOutboundTarget(destinationUrl);

  if (!affiliateId) {
    return normalizedDestination;
  }

  const searchParams = new URLSearchParams({
    lurl: normalizedDestination,
    af_id: affiliateId,
  });

  return `${DMM_AFFILIATE_TRACKING_URL}?${searchParams.toString()}`;
}

export function buildFallbackOutboundUrl(target: string = ""): string {
  return buildAffiliateUrl(normalizeOutboundTarget(target));
}
