"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { sampleProducts } from "@/data/products";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return sampleProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "検索" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-extrabold mb-6">
          🔍 <span className="gradient-text">作品検索</span>
        </h1>

        <div className="max-w-xl mx-auto relative">
          <FaSearch
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
          />
          <input
            type="text"
            placeholder="キーワードで検索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/5 border border-[var(--color-border)] text-white placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-lg"
          />
        </div>
      </motion.div>

      {query && (
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 text-center">
          「{query}」の検索結果: {results.length}件
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-20 text-[var(--color-text-secondary)]">
          <div className="text-5xl mb-4">😢</div>
          <p>一致する作品が見つかりませんでした</p>
        </div>
      ) : (
        <div className="text-center py-20 text-[var(--color-text-secondary)]">
          <div className="text-5xl mb-4">💡</div>
          <p>キーワードを入力して作品を検索</p>
        </div>
      )}

      <Footer />
    </main>
  );
}
