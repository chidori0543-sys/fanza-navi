import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ArticlesPage from "@/app/articles/ArticlesPage";
import GenrePage, {
  dynamicParams as genreDynamicParams,
  generateMetadata as generateGenreMetadata,
  generateStaticParams as generateGenreStaticParams,
} from "@/app/genre/[slug]/page";
import ReviewsIndexPage from "@/app/reviews/page";
import ReviewPage, {
  dynamicParams as reviewDynamicParams,
  generateMetadata as generateReviewMetadata,
  generateStaticParams as generateReviewStaticParams,
} from "@/app/reviews/[slug]/page";
import { genreSlugs } from "@/data/genres";
import { reviewSlugs, reviews } from "@/data/reviews";
import {
  ROUTES,
  getGenreRoute,
  getReviewRoute,
  toAbsoluteUrl,
} from "@/lib/site";

describe("site routes", () => {
  it("builds root-relative routes for genres and reviews", () => {
    expect(ROUTES.genres).toBe("/genre");
    expect(ROUTES.reviews).toBe("/reviews");
    expect(getGenreRoute("vr")).toBe("/genre/vr");
    expect(getReviewRoute("popular-series-latest-review")).toBe(
      "/reviews/popular-series-latest-review"
    );
  });

  it("disables dynamic params and generates static params for every genre and review", async () => {
    const genreParams = await generateGenreStaticParams();
    const reviewParams = await generateReviewStaticParams();

    expect(genreDynamicParams).toBe(false);
    expect(reviewDynamicParams).toBe(false);
    expect(genreParams).toEqual(genreSlugs.map((slug) => ({ slug })));
    expect(reviewParams).toEqual(reviewSlugs.map((slug) => ({ slug })));
  });

  it("generates canonical metadata for genre and review pages", async () => {
    const genreMetadata = await generateGenreMetadata({
      params: Promise.resolve({ slug: "vr" }),
    });
    const reviewMetadata = await generateReviewMetadata({
      params: Promise.resolve({ slug: reviews[0].slug }),
    });

    expect(genreMetadata.alternates?.canonical).toBe(toAbsoluteUrl(getGenreRoute("vr")));
    expect(String(genreMetadata.title)).toContain("VR");
    expect(genreMetadata.description).toContain("VR");

    expect(reviewMetadata.alternates?.canonical).toBe(
      toAbsoluteUrl(getReviewRoute(reviews[0].slug))
    );
    expect(String(reviewMetadata.title)).toContain(reviews[0].title);
    expect(reviewMetadata.description).toContain(reviews[0].excerpt);
  });

  it("renders a static genre page with intro copy, review links, and product cards", async () => {
    const page = await GenrePage({
      params: Promise.resolve({ slug: "vr" }),
    });

    render(page);

    expect(screen.getByRole("heading", { level: 1, name: /^VR$/ })).toBeInTheDocument();
    expect(
      screen.getByText(/視聴環境を整えてから選ぶと満足度が上がりやすい/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /レビューを読む/i })).toHaveAttribute(
      "href",
      getReviewRoute("vr-immersive-viewing-review")
    );
    expect(screen.queryByRole("link", { name: "ジャンル別" })).toBeNull();
    expect(screen.getAllByRole("link", { name: /詳細を見る/i }).length).toBeGreaterThan(0);
  });

  it("renders a static review page with affiliate CTA and related products", async () => {
    const page = await ReviewPage({
      params: Promise.resolve({ slug: reviews[0].slug }),
    });

    render(page);

    expect(
      screen.getByRole("heading", {
        name: reviews[0].title,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: reviews[0].ctaLabel })).toHaveAttribute(
      "href",
      reviews[0].affiliateUrl
    );
    expect(screen.getByRole("link", { name: "レビュー一覧" })).toHaveAttribute(
      "href",
      ROUTES.reviews
    );
    const image = screen.getByAltText(reviews[0].heroImageAlt);
    expect(image.tagName).toBe("IMG");
    expect(image).toHaveAttribute("src", reviews[0].heroImageUrl);
    expect(screen.getByText(/こちらもおすすめ/i)).toBeInTheDocument();
  });

  it("renders a review index route for the articles funnel", () => {
    const { container } = render(React.createElement(ReviewsIndexPage));

    expect(screen.getByRole("heading", { level: 1, name: /レビュー一覧/i })).toBeInTheDocument();
    expect(container.querySelector(`a[href="${getReviewRoute(reviews[0].slug)}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${getGenreRoute("popular")}"]`)).not.toBeNull();
  });

  it("adds review funnel links to the articles discovery page", () => {
    const { container } = render(React.createElement(ArticlesPage));

    expect(screen.getByRole("link", { name: /レビュー一覧を見る/i })).toHaveAttribute(
      "href",
      ROUTES.reviews
    );
    expect(container.querySelector(`a[href="${getReviewRoute(reviews[0].slug)}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${getGenreRoute("vr")}"]`)).not.toBeNull();
  });
});
