import { describe, it, expect } from "vitest";
import { getReviewBySlug, reviews } from "@/data/reviews";

describe("review data", () => {
  it("contains at least three reviews", () => {
    expect(reviews.length).toBeGreaterThanOrEqual(3);
  });

  it("provides stable slugs for static generation", () => {
    const slugs = reviews.map((review) => review.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.every((slug) => slug.length > 0)).toBe(true);
  });

  it("includes long-form content fields for each review", () => {
    for (const review of reviews) {
      expect(review.title).toBeTruthy();
      expect(review.excerpt).toBeTruthy();
      expect(review.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(review.body.length).toBeGreaterThan(0);
    }
  });

  it("finds a review by slug", () => {
    const firstReview = reviews[0];
    expect(getReviewBySlug(firstReview.slug)).toEqual(firstReview);
  });
});
