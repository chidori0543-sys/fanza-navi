"use client";

import { FaArrowRight } from "react-icons/fa";
import { ROUTES } from "@/lib/site";

const footerSections = [
  {
    title: "人気導線",
    links: [
      { href: ROUTES.ranking, label: "月間ランキング" },
      { href: ROUTES.sale, label: "セール情報" },
      { href: ROUTES.newReleases, label: "新作一覧" },
    ],
  },
  {
    title: "読み物",
    links: [
      { href: ROUTES.reviews, label: "レビュー一覧" },
      { href: ROUTES.guide, label: "初心者ガイド" },
      { href: ROUTES.articles, label: "ガイド記事一覧" },
    ],
  },
  {
    title: "運営情報",
    links: [
      { href: ROUTES.about, label: "運営者情報" },
      { href: ROUTES.contact, label: "お問い合わせ" },
      { href: ROUTES.privacy, label: "プライバシーポリシー" },
      { href: ROUTES.terms, label: "利用規約" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)]">
      <div className="content-shell py-14">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <section className="editorial-panel p-6">
            <p className="eyebrow mb-3">Site Note</p>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              落ち着いて選べる FANZA レビューサイトを目指しています。
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
              売れ筋やセールを急かすのではなく、ジャンルの違いとレビューの読みどころを整理して、
              次に見るべき作品へ自然につなげる構成にしています。
            </p>
            <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-xs leading-6 text-[var(--color-text-secondary)]">
              当サイトはDMMアフィリエイトを利用しています。商品情報、価格、配信状況は変わる場合があります。最新の情報はFANZA公式サイトでご確認ください。
            </div>
          </section>

          {footerSections.map((section) => (
            <section key={section.title} className="pt-2">
              <h3 className="mb-4 text-sm font-semibold tracking-[0.1em] text-[var(--color-text-muted)] uppercase">
                {section.title}
              </h3>
              <div className="space-y-3">
                {section.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between gap-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                  >
                    <span>{link.label}</span>
                    <FaArrowRight size={10} className="opacity-70" />
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FANZAナビ</p>
          <p>18歳未満の方はご利用いただけません。</p>
        </div>
      </div>
    </footer>
  );
}
