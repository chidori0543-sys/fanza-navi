import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildAffiliateUrl,
  buildFallbackOutboundUrl,
} from "@/lib/affiliate";

describe("affiliate helpers", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the direct URL when no affiliate id is configured", () => {
    vi.stubEnv("DMM_AFFILIATE_ID", "");

    const url = buildAffiliateUrl(
      "https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=test123/"
    );

    expect(url).toBe(
      "https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=test123/"
    );
  });

  it("wraps the destination URL when an affiliate id is configured", () => {
    vi.stubEnv("DMM_AFFILIATE_ID", "fanza-123");

    const url = buildAffiliateUrl(
      "https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=test123/"
    );

    const parsed = new URL(url);
    expect(parsed.hostname).toBe("al.dmm.co.jp");
    expect(parsed.searchParams.get("af_id")).toBe("fanza-123");
    expect(parsed.searchParams.get("lurl")).toBe(
      "https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=test123/"
    );
  });

  it("returns a valid fallback outbound URL", () => {
    vi.stubEnv("DMM_AFFILIATE_ID", "");

    const url = buildFallbackOutboundUrl();

    expect(url).toMatch(/^https:\/\/www\.dmm\.co\.jp\//);
  });
});
