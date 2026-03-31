"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { sampleProducts } from "@/data/products";

export default function NewReleasesPage() {
  const newItems = sampleProducts
    .filter((p) => p.isNew)
    .concat(sampleProducts.filter((p) => !p.isNew))
    .map((p, i) => ({ ...p, rank: i + 1 }));

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "新作リリース" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          ✨ <span className="gradient-text">新作リリース</span>
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          最新作品をいち早くチェック
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {newItems.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <Footer />
    </main>
  );
}
