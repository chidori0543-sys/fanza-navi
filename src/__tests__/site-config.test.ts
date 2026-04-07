import { describe, expect, it } from "vitest";
import { HAS_CANONICAL_SITE_URL, ROUTES, SITE_URL, toAbsoluteUrl } from "@/lib/site";

describe("site config", () => {
  it("falls back to a local root URL until SITE_URL is configured", () => {
    expect(SITE_URL).toBe("http://localhost:3000");
    expect(HAS_CANONICAL_SITE_URL).toBe(false);
    expect(new URL(SITE_URL).pathname).toBe("/");
  });

  it("uses root-relative routes without a GitHub Pages base path", () => {
    expect(ROUTES.home).toBe("/");
    expect(ROUTES.ranking).toBe("/ranking");
    expect(ROUTES.articles).toBe("/articles");
    expect(Object.values(ROUTES).every((route) => !route.includes("/fanza-navi"))).toBe(true);
  });

  it("can still build absolute URLs from root-relative routes", () => {
    expect(toAbsoluteUrl(ROUTES.ranking)).toBe("http://localhost:3000/ranking");
  });
});
