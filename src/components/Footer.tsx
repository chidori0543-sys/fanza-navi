"use client";

import { FaChartLine, FaTags, FaCompass, FaBookOpen, FaArrowRight, FaGift } from "react-icons/fa";
import { ROUTES, getGenreRoute } from "@/lib/site";

const navSections = [
  {
    title: "探す",
    links: [
      { href: ROUTES.ranking, label: "ランキング", icon: <FaChartLine size={10} /> },
      { href: ROUTES.sale, label: "セール", icon: <FaTags size={10} /> },
      { href: getGenreRoute("popular"), label: "ジャンル別", icon: <FaCompass size={10} /> },
      { href: ROUTES.newReleases, label: "新作", icon: null },
    ],
  },
  {
    title: "読む",
    links: [
      { href: ROUTES.articles, label: "記事一覧", icon: <FaBookOpen size={10} /> },
      { href: ROUTES.guide, label: "初心者ガイド", icon: null },
      { href: ROUTES.compare, label: "VR比較", icon: null },
      { href: ROUTES.articleSaveMoney, label: "セール攻略", icon: null },
    ],
  },
  {
    title: "サイト情報",
    links: [
      { href: ROUTES.about, label: "運営者情報", icon: null },
      { href: ROUTES.privacy, label: "プライバシーポリシー", icon: null },
      { href: ROUTES.terms, label: "利用規約", icon: null },
      { href: ROUTES.contact, label: "お問い合わせ", icon: null },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[rgba(9,10,13,0.6)]">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Guide banner — highest revenue CTA (1,050円/signup) */}
        <a
          href={ROUTES.guide}
          className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-[var(--color-primary)]/25 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-accent)]/5 p-5 transition-all hover:border-[var(--color-primary)]/40 hover:from-[var(--color-primary)]/15 hover:to-[var(--color-accent)]/10 group"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-primary)]/20">
              <FaGift size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--color-text-primary)] sm:text-base">
                🎁 初めての方はこちら — FANZA完全ガイド
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)] sm:text-sm">
                無料登録の手順・支払い方法・お得な買い方まで徹底解説。初回限定クーポンあり！
              </p>
            </div>
          </div>
          <span className="hidden shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary)]/20 transition-transform group-hover:scale-[1.03] sm:inline-flex">
            ガイドを読む <FaArrowRight size={12} />
          </span>
        </a>

        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:gap-8">
          <div>
            <a href={ROUTES.home} className="inline-flex items-center gap-2.5 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-strong)] text-white">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="M5 20V4h3.5l7 9.5V4H19v16h-3.5L8.5 10.5V20H5z" fill="currentColor" />
                </svg>
              </span>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-[var(--color-accent)]">FANZA</span><span className="gradient-text">オトナビ</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--color-text-secondary)]">
              FANZAの人気作品・セール情報・おすすめ作品を<br className="hidden sm:block" />
              まとめた比較ガイドサイトです。
            </p>
          </div>

          {navSections.map((section) => (
            <div key={section.title}>
              <p className="mb-4 text-xs font-semibold tracking-[0.08em] text-[var(--color-text-muted)]">
                {section.title}
              </p>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/5 p-5">
          <p className="mb-2 text-xs font-semibold text-[var(--color-primary)]">
            ⚠️ 免責事項
          </p>
          <div className="text-[11px] text-[var(--color-text-secondary)] space-y-1 leading-relaxed">
            <p>
              当サイトはDMMアフィリエイトを利用しています。リンク経由での購入により、運営者に報酬が発生する場合があります。
            </p>
            <p>価格・セール情報は掲載時点のものです。最新情報はFANZA公式サイトでご確認ください。</p>
            <p>本サイトは18歳未満の方のご利用を固くお断りします。掲載画像・情報の著作権は各権利者に帰属します。</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 border-t border-[var(--color-border)] pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} FANZAオトナビ
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            18歳以上向けコンテンツ
          </p>
        </div>
      </div>
    </footer>
  );
}
