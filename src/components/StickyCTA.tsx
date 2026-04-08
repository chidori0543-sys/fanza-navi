"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGift, FaTimes } from "react-icons/fa";

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
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[rgba(17,18,21,0.96)] shadow-[0_-8px_40px_rgba(143,29,70,0.18)] backdrop-blur-2xl"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-strong)] text-white">
                <FaGift size={14} />
              </span>
              <div className="min-w-0">
                <p className="font-bold text-sm text-[var(--color-text-primary)] truncate">
                  🎁 初回限定クーポンで今すぐお得に
                </p>
                <p className="text-xs text-[var(--color-text-muted)] hidden sm:block">
                  FANZA未登録なら無料登録で特別クーポンGET
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <a
                  href="/guide"
                  className="px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-strong)] hover:opacity-90 transition-all hover:scale-[1.02] whitespace-nowrap shadow-lg shadow-[rgba(143,29,70,0.2)]"
                >
                  無料登録ガイド
                </a>
              <a
                href="/sale"
                className="hidden sm:inline-flex px-3.5 py-2 rounded-full text-sm font-medium text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)] transition-colors whitespace-nowrap"
              >
                セール一覧
              </a>
              <button
                onClick={() => setDismissed(true)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-white/5 transition-colors"
                aria-label="閉じる"
              >
                <FaTimes size={12} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
