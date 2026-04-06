import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { ROUTES, getGenreRoute, getReviewRoute } from "@/lib/site";
import { reviews } from "@/data/reviews";

afterEach(() => {
  cleanup();
});

describe("HomePage", () => {
  it("prioritizes commerce sections and primary ranking CTA", () => {
    const { container } = render(<HomePage />);

    const headings = Array.from(container.querySelectorAll("h2")).map((heading) =>
      heading.textContent?.replace(/\s+/g, " ").trim()
    );

    expect(headings).toEqual([
      "月間ランキングを先にチェック",
      "いま狙いたいセール導線",
      "ジャンルから探す",
      "まず読まれているレビュー",
      "比較・節約ガイドもまとめて読む",
    ]);

    expect(
      screen.getByRole("link", { name: "月間ランキングを見る" })
    ).toHaveAttribute("href", ROUTES.ranking);
    expect(
      screen.getByRole("link", { name: "セール情報を見る" })
    ).toHaveAttribute("href", ROUTES.sale);

    expect(
      screen.getByRole("link", { name: "人気作品ジャンルへ" })
    ).toHaveAttribute("href", getGenreRoute("popular"));
    expect(
      screen.getByRole("link", { name: `${reviews[0].title}のレビューを読む` })
    ).toHaveAttribute("href", getReviewRoute(reviews[0].slug));
    expect(
      screen.getByRole("link", { name: "ガイド記事を一覧で見る" })
    ).toHaveAttribute("href", ROUTES.articles);
  });

  it("uses the sticky CTA to send scrolled visitors to sale", () => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 480,
    });

    render(<HomePage />);
    fireEvent.scroll(window);

    expect(
      screen.getByRole("link", { name: "セール会場へ" })
    ).toHaveAttribute("href", ROUTES.sale);
  });
});
