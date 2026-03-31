"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import GenreFilter from "@/components/GenreFilter";
import Footer from "@/components/Footer";
import { genres, sampleProducts } from "@/data/products";
import { FaArrowUp } from "react-icons/fa";

export default function HomePage() {
  const [activeGenre, setActiveGenre] = useState("all");

  const filteredProducts = useMemo(() => {
    if (activeGenre === "all") return sampleProducts;
    return sampleProducts.filter((p) => p.genre === activeGenre);
  }, [activeGenre]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <main>
      {/* Age gate banner */}
      <div className="bg-[var(--color-primary)]/10 border-b border-[var(--color-primary)]/20 py-2 text-center text-xs text-[var(--color-text-secondary)]">
        ⚠️ 本サイトは18歳以上の方を対象としています
      </div>

      <HeroSection />

      {/* Main content */}
      <section id="ranking" className="max-w-6xl mx-auto px-4 pb-20">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-extrabold mb-2">
            🏆 <span className="gradient-text">作品ランキング</span>
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            ジャンル別に人気作品をチェック
          </p>
        </motion.div>

        {/* Genre filter */}
        <div className="mb-10">
          <GenreFilter
            genres={genres}
            activeGenre={activeGenre}
            onSelect={setActiveGenre}
          />
        </div>

        {/* Product grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGenre}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-[var(--color-text-secondary)]">
            <div className="text-5xl mb-4">🔍</div>
            <p>このジャンルの作品はまだありません</p>
          </div>
        )}

        {/* Load more */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-block px-10 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 transition-opacity text-lg"
          >
            もっと見る →
          </a>
        </div>
      </section>

      {/* Sale banner */}
      <section id="sale" className="max-w-5xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] p-8 md:p-12"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl md:text-4xl font-extrabold mb-3">
              春の大感謝セール開催中！
            </h3>
            <p className="text-lg opacity-90 mb-6">
              対象作品が最大<span className="font-extrabold text-2xl">80%OFF</span>
              ！見逃すな！
            </p>
            <a
              href="#"
              className="inline-block px-8 py-4 rounded-2xl font-bold text-[var(--color-primary)] bg-white hover:bg-gray-100 transition-colors text-lg"
            >
              セール会場へ →
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--color-primary-light)] transition-colors z-50"
        aria-label="ページトップへ"
      >
        <FaArrowUp />
      </button>
    </main>
  );
}
