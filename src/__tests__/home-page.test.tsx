import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { ROUTES, getGenreRoute, getReviewRoute } from "@/lib/site";
import { reviews } from "@/data/reviews";

afterEach(() => {
  cleanup();
});

describe("HomePage", () => {
  it("prioritizes commerce sections and primary ranking CTA", async () => {
    const { container } = render(await HomePage());

    const headings = Array.from(container.querySelectorAll("h2")).map((heading) =>
      heading.textContent?.replace(/\s+/g, " ").trim()
    );

    expect(headings).toContain("まず見ておきたい今月のランキング");
    expect(headings).toContain("いま見る理由があるセール");
    expect(headings).toContain("ジャンルから絞って、そのまま個別ページへ");
    expect(headings).toContain("レビューから温度感をつかむ");
    expect(headings).toContain("支払い方法や比較記事もまとめて見られます");

    expect(
      screen.getByRole("link", { name: /まずは月間ランキングを見る/ })
    ).toHaveAttribute("href", ROUTES.ranking);
    expect(container.querySelector(`a[href="${ROUTES.sale}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${getGenreRoute("popular")}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${getReviewRoute(reviews[0].slug)}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${ROUTES.articles}"]`)).not.toBeNull();
    expect(screen.getAllByRole("link", { name: /FANZAで詳細を見る|FANZAで見る/ }).length).toBeGreaterThan(0);
  });

  it("uses the sticky CTA to send scrolled visitors to sale", async () => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 480,
    });

    render(await HomePage());
    fireEvent.scroll(window);

    expect(screen.getByText(/今回はセール対象を先に見たい人向け/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /セール一覧を見る/ })).toHaveAttribute(
      "href",
      ROUTES.sale
    );
  });
});
