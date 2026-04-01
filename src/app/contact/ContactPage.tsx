"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaClock, FaExclamationTriangle, FaPaperPlane } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `【お名前】${name}\n【メールアドレス】${email}\n\n${message}`;
    const mailtoUrl = `mailto:entrynavi.contact@gmail.com?subject=${encodeURIComponent(
      `[FANZAナビ] ${subject}`
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
    setSent(true);
  };

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

      {/* Contact form */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 md:p-8 mb-8"
      >
        {sent ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2">メーラーが起動しました</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              メールアプリからそのまま送信してください。
              <br />
              通常3営業日以内にご返信いたします。
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-sm text-[var(--color-primary)] hover:underline"
            >
              もう一度入力する
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <FaEnvelope size={16} />
              </div>
              <h2 className="font-bold text-lg">お問い合わせフォーム</h2>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5">
                お名前 <span className="text-[var(--color-primary)]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="山田 太郎"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--color-border)] text-white placeholder-[var(--color-text-secondary)]/50 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5">
                メールアドレス <span className="text-[var(--color-primary)]">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--color-border)] text-white placeholder-[var(--color-text-secondary)]/50 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5">
                件名 <span className="text-[var(--color-primary)]">*</span>
              </label>
              <select
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--color-border)] text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              >
                <option value="" className="bg-[var(--color-bg-dark)]">
                  選択してください
                </option>
                <option value="記事内容について" className="bg-[var(--color-bg-dark)]">
                  記事内容の誤り・修正依頼
                </option>
                <option value="サイトの不具合" className="bg-[var(--color-bg-dark)]">
                  サイトの不具合報告
                </option>
                <option value="広告・メディア連携" className="bg-[var(--color-bg-dark)]">
                  広告掲載・メディア連携のご相談
                </option>
                <option value="その他" className="bg-[var(--color-bg-dark)]">
                  その他のお問い合わせ
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5">
                お問い合わせ内容 <span className="text-[var(--color-primary)]">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="お問い合わせ内容を入力してください"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--color-border)] text-white placeholder-[var(--color-text-secondary)]/50 focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] hover:opacity-90 transition-opacity"
            >
              <FaPaperPlane size={14} />
              送信する
            </button>
          </form>
        )}
      </motion.div>

      {/* Response time */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 mb-8"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
            <FaClock size={16} />
          </div>
          <div>
            <h2 className="font-bold">返信について</h2>
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
