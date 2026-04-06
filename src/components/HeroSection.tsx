"use client";

import { motion } from "framer-motion";
import { FaArrowRight, FaChartLine, FaShieldAlt, FaTags } from "react-icons/fa";
import SocialProof from "@/components/SocialProof";
import { ROUTES } from "@/lib/site";

const features = [
  {
    icon: <FaChartLine size={18} />,
    title: "月間ランキングを起点に比較",
    desc: "いま売れている作品を上から確認して迷いを減らします。",
  },
  {
    icon: <FaTags size={18} />,
    title: "セール導線をすぐ横に配置",
    desc: "ランキングの次に値引き作品へ移って価格差を確認できます。",
  },
  {
    icon: "📝",
    title: "レビューで失敗を避ける",
    desc: "ジャンル別のレビュー記事から作品の傾向を先に把握できます。",
  },
  {
    icon: "🧭",
    title: "6ジャンルへそのまま移動",
    desc: "人気作、セール、VRなど高意図カテゴリへ直行できます。",
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-primary)] opacity-[0.07] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[var(--color-accent)] opacity-[0.05] blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 mb-6"
        >
          <FaShieldAlt size={12} className="text-[var(--color-primary)]" />
          <span className="text-sm">ランキングとセール導線を先に置いたFANZA landing</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight"
        >
          <span className="gradient-text">FANZA</span>
          <span className="text-white">月間ランキングとセール導線を最短チェック</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto"
        >
          売れ筋の確認、値下げ作品の探索、レビュー経由の比較までを
          <br className="hidden sm:block" />
          1ページで繋げる commerce-first の導線に組み直しました。
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <a
            href={ROUTES.ranking}
            className="px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] hover:from-[var(--color-primary-light)] hover:to-[var(--color-primary)] transition-all duration-300 text-lg pulse-glow"
          >
            <FaChartLine className="inline mr-2" />
            いま売れ筋へ
          </a>
          <a
            href={ROUTES.sale}
            className="px-8 py-4 rounded-2xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-lg"
          >
            <FaTags className="inline mr-2" />
            値下げ作品へ
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mb-10"
        >
          <SocialProof />
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="glass-card p-5 text-center"
            >
              <div className="mb-2 flex justify-center text-2xl text-[var(--color-primary)]">
                {f.icon}
              </div>
              <h3 className="font-bold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-8"
        >
          <a
            href={ROUTES.reviews}
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:underline"
          >
            レビュー一覧へ進む <FaArrowRight size={12} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
