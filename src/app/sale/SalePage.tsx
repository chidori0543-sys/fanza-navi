"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { sampleProducts } from "@/data/products";

export default function SalePage() {
  const saleItems = sampleProducts
    .filter((p) => p.isSale)
    .concat(sampleProducts.filter((p) => !p.isSale).slice(0, 3))
    .map((p, i) => ({ ...p, rank: i + 1 }));

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "セール・キャンペーン" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          💰 <span className="gradient-text">セール・キャンペーン</span>
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          お得な割引作品を見逃すな！
        </p>
      </motion.div>

      {/* Sale banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] p-6 md:p-8 mb-10 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="relative">
          <p className="text-4xl font-extrabold mb-2">🎉 最大80%OFF</p>
          <p className="opacity-90">春の大感謝セール開催中！対象作品多数</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {saleItems.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <Footer />
    </main>
  );
}
