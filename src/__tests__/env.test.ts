import { beforeEach, describe, expect, it, vi } from "vitest";

const DEFAULT_SITE_URL = "https://fragrant-thunder-2202.chidori0543.workers.dev";

describe("getSiteConfig", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("reads SITE_URL from the environment", async () => {
    vi.stubEnv("SITE_URL", "https://example.com");

    const { getSiteConfig } = await import("@/lib/env");

    expect(getSiteConfig().siteUrl).toBe("https://example.com");
  });

  it("falls back to a safe default SITE_URL when unset or invalid", async () => {
    vi.stubEnv("SITE_URL", "not a url");

    const { getSiteConfig } = await import("@/lib/env");

    expect(getSiteConfig().siteUrl).toBe(DEFAULT_SITE_URL);
  });
});
