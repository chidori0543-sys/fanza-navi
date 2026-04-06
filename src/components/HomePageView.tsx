"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import ExitPopup from "@/components/ExitPopup";
import ReviewCard from "@/components/ReviewCard";
import type { GenreLandingPage } from "@/data/genres";
import type { Product } from "@/data/products";
import type { Review } from "@/data/reviews";
import { ROUTES, getGenreRoute } from "@/lib/site";
import {
  FaArrowRight,
  FaArrowUp,
  FaBalanceScale,
  FaBookOpen,
  FaCoins,
  FaCompass,
  FaCreditCard,
  FaTags,
} from "react-icons/fa";

function getDiscountPercent(product: Product) {
  if (!product.salePrice) {
    return 0;
  }

  return Math.round((1 - product.salePrice / product.price) * 100);
}

const supportingGuides = [
  {
    href: ROUTES.guide,
    title: "FANZA完全ガイド",
    description: "最初の登録から購入までの流れを短時間で確認できます。",
    icon: FaBookOpen,
    accent: "bg-blue-500/10 text-blue-400",
  },
  {
    href: ROUTES.compare,
    title: "VR・通常作品の比較",
    description: "視聴スタイルごとの違いを整理して無駄買いを減らします。",
    icon: FaBalanceScale,
    accent: "bg-purple-500/10 text-purple-400",
  },
  {
    href: ROUTES.articleFanzaPayment,
    title: "支払い方法ガイド",
    description: "クレカ、PayPay、ポイントの使い分けをまとめています。",
    icon: FaCreditCard,
    accent: "bg-green-500/10 text-green-400",
  },
  {
    href: ROUTES.articleSaveMoney,
    title: "セール攻略法",
    description: "クーポンとポイント活用で購入単価を抑える記事です。",
    icon: FaCoins,
    accent: "bg-amber-500/10 text-amber-400",
  },
];

export default function HomePageView({
  rankingPreview,
  salePreview,
  featuredGenres,
  featuredReviews,
}: {
  rankingPreview: Product[];
  salePreview: Product[];
  featuredGenres: GenreLandingPage[];
  featuredReviews: Review[];
}) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <main className="pb-24">
      <div className="bg-[var(--color-primary)]/10 border-b border-[var(--color-primary)]/20 py-2 text-center text-xs text-[var(--color-text-secondary)]">
        ⚠️ 本サイトは18歳以上の方を対象としています
      </div>

      <HeroSection />

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">月間ランキングを先にチェック</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              最初に売れ筋を確認してから、レビューやセールに移る導線を上段に固定しています。
            </p>
          </div>
          <a
            href={ROUTES.ranking}
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:underline"
          >
            月間ランキングを見る <FaArrowRight size={12} />
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {rankingPreview.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="glass-card p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <span className="inline-flex rounded-full bg-[var(--color-primary)]/15 px-3 py-1 text-xs font-bold text-[var(--color-primary)]">
                  #{product.rank}
                </span>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  レビュー {product.reviewCount}件
                </span>
              </div>
              <h3 className="mb-3 text-lg font-bold leading-tight">{product.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-3">
                {product.description}
              </p>
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)]">通常価格</p>
                  <p className="text-lg font-bold">
                    ¥{product.salePrice?.toLocaleString() ?? product.price.toLocaleString()}
                  </p>
                </div>
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  作品詳細を見る <FaArrowRight size={11} />
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-[var(--color-text-secondary)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">いま狙いたいセール導線</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              値引き率が大きい作品と節約ガイドを近くに置いて、比較から購入判断までを短縮します。
            </p>
          </div>
          <a
            href={ROUTES.sale}
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:underline"
          >
            セール情報を見る <FaArrowRight size={12} />
          </a>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.95fr]">
          <div className="grid gap-4 sm:grid-cols-3">
            {salePreview.map((product, index) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="glass-card p-5"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">
                    <FaTags size={10} /> {getDiscountPercent(product)}% OFF
                  </span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {product.reviewCount}件
                  </span>
                </div>
                <h3 className="mb-2 font-bold leading-tight">{product.title}</h3>
                <p className="mb-4 text-sm text-[var(--color-text-secondary)] line-clamp-3">
                  {product.description}
                </p>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-[var(--color-text-secondary)] line-through">
                      ¥{product.price.toLocaleString()}
                    </p>
                    <p className="text-lg font-bold text-white">
                      ¥{product.salePrice?.toLocaleString()}
                    </p>
                  </div>
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10"
                  >
                    FANZAで見る <FaArrowRight size={11} />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card flex h-full flex-col justify-between p-6"
          >
            <div>
              <p className="mb-2 text-sm font-bold text-[var(--color-primary)]">購入前の確認</p>
              <h3 className="mb-3 text-xl font-extrabold">セール会場に入る前に節約パターンも確認</h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                クーポン、ポイント還元、まとめ買いの順で見ていくと、割引率だけで判断するより失敗しにくくなります。
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href={ROUTES.articleSaveMoney}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                節約ガイドを読む <FaArrowRight size={12} />
              </a>
              <a
                href={ROUTES.sale}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                セール会場へ進む <FaArrowRight size={12} />
              </a>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">ジャンルから探す</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              レビュー導線付きのジャンルページへ直接入れるよう、主要6ジャンルを前面に置いています。
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <FaCompass size={12} className="text-[var(--color-primary)]" />
            6ジャンルを静的ページで公開
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredGenres.map((genre, index) => (
            <motion.a
              key={genre.slug}
              href={getGenreRoute(genre.slug)}
              aria-label={`${genre.name}ジャンルへ`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass-card group p-5 transition-colors hover:border-[var(--color-primary)]/30"
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl"
                  style={{ backgroundColor: `${genre.color}1A`, color: genre.color }}
                >
                  {genre.icon}
                </div>
                <div>
                  <h3 className="font-bold">{genre.name}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">{genre.headline}</p>
                </div>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {genre.highlight}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)]">
                このジャンルを見る <FaArrowRight size={11} />
              </span>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">まず読まれているレビュー</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              購入前に作風と満足度を把握できるよう、導線の中段にレビューを配置しています。
            </p>
          </div>
          <a
            href={ROUTES.reviews}
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:underline"
          >
            レビュー一覧を見る <FaArrowRight size={12} />
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featuredReviews.map((review) => (
            <ReviewCard key={review.slug} review={review} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">比較・節約ガイドもまとめて読む</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              高意図導線のあとに、支払い方法や比較記事をまとめて置いて補助情報へ送ります。
            </p>
          </div>
          <a
            href={ROUTES.articles}
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:underline"
          >
            ガイド記事を一覧で見る <FaArrowRight size={12} />
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {supportingGuides.map((guide, index) => {
            const Icon = guide.icon;

            return (
              <motion.a
                key={guide.href}
                href={guide.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="glass-card group p-5"
              >
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${guide.accent}`}>
                  <Icon size={18} />
                </div>
                <h3 className="mb-2 font-bold group-hover:text-[var(--color-primary-light)] transition-colors">
                  {guide.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {guide.description}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)]">
                  続きを読む <FaArrowRight size={11} />
                </span>
              </motion.a>
            );
          })}
        </div>
      </section>

      <Footer />

      <StickyCTA />
      <ExitPopup />

      <button
        onClick={scrollToTop}
        className="fixed bottom-16 right-6 w-12 h-12 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--color-primary-light)] transition-colors z-40"
        aria-label="ページトップへ"
      >
        <FaArrowUp />
      </button>
    </main>
  );
}
