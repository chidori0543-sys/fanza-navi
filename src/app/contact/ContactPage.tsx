"use client";

import { motion } from "framer-motion";
import { FaEnvelope, FaClock, FaExclamationTriangle } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "お問い合わせ" }]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          ✉️ <span className="gradient-text">お問い合わせ</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg">
          ご質問・ご意見・記事に関するご指摘など、お気軽にご連絡ください
        </p>
      </motion.div>

      {/* Contact methods */}
      <section className="space-y-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <FaEnvelope size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg">メールでのお問い合わせ</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                下記メールアドレスまでお送りください
              </p>
            </div>
          </div>
          <a
            href="mailto:fanza-navi-contact@example.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 transition-opacity"
          >
            <FaEnvelope size={14} />
            fanza-navi-contact@example.com
          </a>
          <p className="text-xs text-[var(--color-text-secondary)] mt-3">
            ※ メーラーが起動しない場合は、上記アドレスをコピーしてご利用ください
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400">
              <FaClock size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg">返信について</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                通常3営業日以内にご返信いたします
              </p>
            </div>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            お問い合わせ内容により、返信までお時間をいただく場合がございます。
            また、内容によってはご返信いたしかねる場合もございますので、あらかじめご了承ください。
          </p>
        </motion.div>
      </section>

      {/* Note */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 border-yellow-500/20 mb-12"
      >
        <div className="flex items-start gap-3">
          <FaExclamationTriangle
            className="text-yellow-400 shrink-0 mt-0.5"
            size={16}
          />
          <div>
            <h3 className="font-bold text-sm mb-2">お問い合わせの前にご確認ください</h3>
            <ul className="text-sm text-[var(--color-text-secondary)] space-y-2 leading-relaxed">
              <li>
                • 当サイトはFANZA（DMM）の公式サイトではありません。FANZA公式へのお問い合わせは
                <a
                  href="https://www.dmm.com/help/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-primary)] hover:underline ml-1"
                >
                  DMM公式ヘルプ
                </a>
                をご利用ください。
              </li>
              <li>
                • 作品の購入・返金・アカウントに関するお問い合わせには対応できません。
              </li>
              <li>
                • 記事内容の誤り・リンク切れのご報告は大変助かります。
              </li>
              <li>
                • 広告掲載・メディア連携のご相談もお気軽にどうぞ。
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      <Footer />
    </main>
  );
}
