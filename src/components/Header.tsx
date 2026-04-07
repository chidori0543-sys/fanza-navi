"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaBookOpen,
  FaChartLine,
  FaCompass,
  FaFire,
  FaSearch,
  FaTags,
  FaTimes,
} from "react-icons/fa";
import { ROUTES, getGenreRoute } from "@/lib/site";

const primaryLinks = [
  { href: ROUTES.ranking, label: "ランキング", icon: <FaChartLine size={12} /> },
  { href: ROUTES.sale, label: "セール", icon: <FaTags size={12} /> },
  { href: getGenreRoute("popular"), label: "ジャンル別", icon: <FaCompass size={12} /> },
  { href: ROUTES.reviews, label: "レビュー", icon: <FaBookOpen size={12} /> },
];

const utilityLinks = [
  { href: ROUTES.newReleases, label: "新作" },
  { href: ROUTES.guide, label: "ガイド" },
  { href: ROUTES.search, label: "検索入口" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-[var(--color-border)] bg-[rgba(17,18,21,0.82)] backdrop-blur-xl">
      <div className="content-shell">
        <div className="flex min-h-[72px] items-center justify-between gap-4 py-4">
          <a href={ROUTES.home} className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
                <FaFire size={16} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium tracking-[0.12em] text-[var(--color-text-muted)] uppercase">
                  FANZA Review Guide
                </p>
                <p className="truncate text-lg font-semibold text-[var(--color-text-primary)]">
                  FANZAナビ
                </p>
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-2 lg:flex">
            {primaryLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <div className="hidden items-center gap-2 lg:flex">
              {utilityLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="muted-link text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <a
              href={ROUTES.search}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
              aria-label="検索入口"
            >
              <FaSearch size={13} />
            </a>
          </div>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>

        <div className="hidden border-t border-[var(--color-border)] py-3 md:flex lg:hidden">
          <div className="flex flex-wrap gap-2">
            {[...primaryLinks, ...utilityLinks].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[var(--color-border)] md:hidden"
          >
            <div className="content-shell py-4">
              <div className="editorial-panel p-4">
                <p className="mb-3 text-xs font-medium tracking-[0.12em] text-[var(--color-text-muted)] uppercase">
                  目的から探す
                </p>
                <div className="grid gap-2">
                  {primaryLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {utilityLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="rounded-full border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
