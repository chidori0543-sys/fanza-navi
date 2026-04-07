"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import PrimaryCta from "@/components/PrimaryCta";
import { ROUTES } from "@/lib/site";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-0 right-0 z-50 px-3"
        >
          <div className="content-shell">
            <div className="mx-auto flex items-center justify-between gap-3 rounded-[28px] border border-[var(--color-border-strong)] bg-[rgba(17,18,21,0.96)] p-3 shadow-[0_26px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="min-w-0 text-white">
                <p className="text-[11px] font-medium tracking-[0.12em] text-[var(--color-accent)] uppercase">
                  Sale Route
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                  今回はセール対象を先に見たい人向けの入口です。
                </p>
                <p className="hidden text-xs leading-6 text-[var(--color-text-secondary)] sm:block">
                  通常価格との差とレビュー件数をまとめて見られるので、値引きだけで決めたくないときに使えます。
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <PrimaryCta href={ROUTES.sale} size="sm">
                  セール一覧を見る
                </PrimaryCta>
                <button
                  onClick={() => setDismissed(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                  aria-label="閉じる"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
