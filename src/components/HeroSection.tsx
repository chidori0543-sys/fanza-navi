"use client";

import { motion } from "framer-motion";
import { FaChartLine, FaCompass, FaShieldAlt, FaTags } from "react-icons/fa";
import PrimaryCta from "@/components/PrimaryCta";
import { ROUTES } from "@/lib/site";

const features = [
  {
    icon: <FaChartLine size={16} />,
    title: "ランキングから入る",
    desc: "今月動いている作品を先に見ると、比較の基準が作りやすくなります。",
  },
  {
    icon: <FaTags size={16} />,
    title: "セールで価格差を見る",
    desc: "値引き率だけでなく、通常価格やレビュー件数も一緒に見られます。",
  },
  {
    icon: <FaCompass size={16} />,
    title: "レビューで雰囲気を掴む",
    desc: "作風や向いている人を先に把握してから詳細ページへ進めます。",
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-18 pt-10 md:pt-14">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-[rgba(163,55,88,0.18)] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[260px] w-[340px] rounded-full bg-[rgba(211,175,111,0.1)] blur-[90px]" />
      </div>

      <div className="content-shell relative">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="editorial-panel overflow-hidden px-6 py-8 md:px-8 md:py-10"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-highlight)] px-4 py-2 text-xs font-medium tracking-[0.12em] text-[var(--color-accent)] uppercase">
              <FaShieldAlt size={11} />
              Adult discovery guide
            </div>

            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              <span className="gradient-text">見やすさと安心感を優先して</span>
              <br />
              FANZA作品を比較できる入口に整えています。
            </h1>

            <p className="mt-6 max-w-2xl text-[15px] leading-8 text-[var(--color-text-secondary)] md:text-lg">
              売れ筋、セール、レビュー、ジャンル導線をひとつの流れにまとめて、何を先に見ればいいかで迷いにくくしました。
              勢いで外部ページへ飛ばすのではなく、比較してから納得して進めることを重視しています。
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <PrimaryCta href={ROUTES.ranking} size="lg" className="pulse-glow">
                まずは月間ランキングを見る
              </PrimaryCta>
              <PrimaryCta href={ROUTES.reviews} size="lg" variant="outline">
                レビュー一覧から入る
              </PrimaryCta>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
                    {feature.icon}
                  </div>
                  <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                    {feature.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="editorial-surface p-6 md:p-7"
          >
            <p className="eyebrow">Start Here</p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--color-text-primary)]">
              今の自分に近い入口
            </h2>
            <div className="mt-5 space-y-3">
              <a
                href={ROUTES.ranking}
                className="block rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 transition-colors hover:border-[var(--color-border-strong)]"
              >
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">売れ筋を先に見たい</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  ランキングから入ると、今月動いている作品の温度感をつかみやすいです。
                </p>
              </a>
              <a
                href={ROUTES.sale}
                className="block rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 transition-colors hover:border-[var(--color-border-strong)]"
              >
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">値下げ中を優先したい</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  セール一覧で価格差を確認してから、必要ならレビューへ戻れます。
                </p>
              </a>
              <a
                href={ROUTES.search}
                className="block rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 transition-colors hover:border-[var(--color-border-strong)]"
              >
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">ジャンルから絞りたい</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                  人気、VR、セールなどの切り口から、そのまま個別ページへ進めます。
                </p>
              </a>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
