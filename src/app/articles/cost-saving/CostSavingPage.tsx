"use client";

import { motion } from "framer-motion";
import { FaArrowDown, FaBookOpen, FaBoxes, FaCalculator, FaCalendarAlt, FaCheckCircle, FaCoins, FaFire, FaGift, FaHeart, FaPlayCircle, FaQuestionCircle, FaRegLightbulb, FaRocket, FaTags } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import PrimaryCta from "@/components/PrimaryCta";
import { ROUTES } from "@/lib/site";

/* ───────────────────────── data ───────────────────────── */

const methods = [
  {
    icon: <FaGift size={18} />,
    number: 1,
    title: "初回限定クーポンを使う",
    description:
      "FANZAに新規登録すると、初回購入で使えるクーポンが自動的に配布されます。割引率は最大50%OFFと非常に大きく、対象作品も幅広いため、まだ未登録の方はこれだけで数千円お得になります。登録は無料で、メールアドレスだけで完了するので、まずはクーポンをもらうところから始めましょう。これが最もシンプルかつ効果が大きい節約方法です。",
    proTip:
      "クーポンには有効期限があります。登録後すぐに使わなくても、ウィッシュリストに気になる作品を入れておき、期限内にまとめて購入するのが賢い使い方です。",
    cta: {
      label: "まだ未登録ならこちらから",
      href: ROUTES.guide,
    },
  },
  {
    icon: <FaCalendarAlt size={18} />,
    number: 2,
    title: "週末セールを活用する",
    description:
      "FANZAでは毎週金曜18:00〜日曜23:59に週末セールが開催され、対象作品が30〜50%OFFになります。ラインナップは毎週入れ替わるため、金曜夕方にチェックする習慣をつけるだけで、定価で買う回数を大幅に減らせます。週末セールは年間を通して最も安定して開催されるセールなので、まずはこのリズムを押さえることが節約の基本です。",
    proTip:
      "金曜夕方にFANZAトップページをチェックするのが鉄則。月曜まで延長されるケースもあるので、見逃したら月曜の朝にも確認してみましょう。",
    link: {
      label: "セールカレンダーで時期を確認",
      href: ROUTES.articleSaleCalendar,
    },
  },
  {
    icon: <FaCoins size={18} />,
    number: 3,
    title: "DMMポイントまとめ買いで還元",
    description:
      "DMMポイントを事前にまとめて購入すると、チャージ額に応じてボーナスポイントが還元されます。都度払いよりも実質的に安く作品を入手でき、セール割引との併用も可能です。大型セール前にまとめてチャージしておくことで、割引+ポイント還元の二重でお得になります。特に10,000円以上のチャージから還元率が上がるため、月の予算をまとめて入金するのが効率的です。",
    proTip:
      "クレジットカード払いならカードのポイントも付くため、実質3重でお得。大型セール前にまとめてチャージするのがベストタイミングです。",
    table: {
      headers: ["チャージ額", "還元率", "実質お得額"],
      rows: [
        ["5,000円", "約3%", "約150円分"],
        ["10,000円", "約5%", "約500円分"],
        ["30,000円", "約10%", "約3,000円分"],
      ],
    },
  },
  {
    icon: <FaFire size={18} />,
    number: 4,
    title: "月初セールで大物を狙う",
    description:
      "毎月1日〜7日頃に開催される月初セールは、前月の人気作品が最大70%OFFになる大規模セールです。週末セールより割引率が高い傾向があり、普段セール対象にならない人気作品も登場します。月末にウィッシュリストを整理しておき、月初セールの開始と同時にチェックするのが攻略法です。まとめ買いセットが特にお得になることが多いので、複数作品を狙う方は特に注目です。",
    proTip:
      "月末にウィッシュリストを見返して、月初セールの対象になりそうな作品をマークしておくと、開始直後に迷わず購入できます。",
  },
  {
    icon: <FaBoxes size={18} />,
    number: 5,
    title: "まとめ買いセットを活用",
    description:
      "FANZAではシリーズ作品やメーカー別に3本セット・5本セットなどのまとめ買いパックが販売されています。単品で買うよりも30〜50%安くなるため、シリーズを一気に揃えたい場合は圧倒的にお得です。セット対象はセール時にさらに割引されることもあるため、月初セールや大型セールとの組み合わせが最強の節約法になります。",
    proTip:
      "お気に入りの女優やシリーズが決まっている場合は、セット販売ページを直接チェック。単品合計との差額を確認してからセットを購入すると、お得感がより実感できます。",
  },
  {
    icon: <FaHeart size={18} />,
    number: 6,
    title: "ウィッシュリストで値下げを待つ",
    description:
      "気になる作品をウィッシュリストに登録しておくと、その作品がセール対象になった際に通知を受け取れます。急いで見たい作品でなければ、この方法で最安タイミングまで待つのが賢い選択です。FANZAの作品はいずれかのセールで対象になることが多いため、数週間〜1ヶ月ほど待てば割引価格で購入できるチャンスが巡ってきます。",
    proTip:
      "ウィッシュリストは定期的に整理しましょう。月に1回見返して、本当に欲しい作品だけを残すことで、衝動買いを防げます。",
  },
  {
    icon: <FaPlayCircle size={18} />,
    number: 7,
    title: "月額見放題プランの活用",
    description:
      "月に3本以上作品を見るヘビーユーザーなら、月額2,980円の見放題プランが圧倒的にコスパが良い選択肢です。対象作品は数万本以上で、新作以外のほとんどのジャンルをカバーしています。単品購入で月5,000円以上使っている方は、見放題プランに切り替えるだけで月2,000〜3,000円の節約になります。ただし最新作は対象外のことが多いので、新作は単品購入と使い分けるのがベストです。",
    proTip:
      "見放題で旧作を楽しみつつ、本当に欲しい新作だけ単品購入する「ハイブリッド戦略」が最もコスパが高い使い方です。",
    cta: {
      label: "FANZAの始め方を確認する",
      href: ROUTES.guide,
    },
  },
];

const faqs = [
  {
    q: "クーポンの併用はできますか？",
    a: "基本的に、FANZAのクーポンは1回の購入につき1枚のみ使用可能です。複数のクーポンを同時に適用することはできません。ただし、DMMポイント払いとクーポンの併用は可能な場合があるため、ポイントまとめ買い割引 + クーポンの組み合わせが最もお得な購入方法になります。クーポンの利用条件は個別に異なるため、使用前に必ず注意事項を確認しましょう。",
  },
  {
    q: "DMMポイントに有効期限はありますか？",
    a: "DMMポイントの有効期限は、最後のポイント取得・使用から1年間です。定期的にFANZAで作品を購入している方であれば、実質的に期限切れを心配する必要はほぼありません。ただし、キャンペーンで付与されたボーナスポイントには個別の有効期限が設定されていることがあるため、ポイント残高ページで期限を確認する習慣をつけておくと安心です。",
  },
  {
    q: "セール品の返品はできますか？",
    a: "FANZAのデジタルコンテンツは、セール品に限らず原則として購入後の返品・返金はできません。これはデジタル商品の特性上、ダウンロード後の返品が難しいためです。購入前にサンプル動画やレビューを確認し、ウィッシュリスト機能で吟味してから購入することをおすすめします。万が一、再生できないなどの技術的な問題がある場合は、DMMカスタマーサポートに問い合わせることで対応してもらえる場合があります。",
  },
];

const savingsSimulation = [
  { label: "月額出費（節約前）", value: "¥5,000" },
  { label: "週末セール活用", value: "−¥1,000〜1,500" },
  { label: "ポイント還元", value: "−¥250〜500" },
  { label: "クーポン・まとめ買い", value: "−¥250〜500" },
  { label: "月額出費（節約後）", value: "¥2,500〜3,500", highlight: true },
];

/* ───────────────────────── component ───────────────────────── */

export default function CostSavingPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "記事一覧", href: ROUTES.articles },
          { label: "安く買う7つの方法" },
        ]}
      />

      {/* ───── Hero ───── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          <FaCoins className="inline text-[var(--color-accent)]" />{" "}
          <span className="gradient-text">
            FANZAで安く買う7つの方法【2026年版】
          </span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto leading-relaxed">
          クーポン、セール、ポイント還元、まとめ買い——知っているだけで年間数万円変わる7つの節約テクニックを、具体的な手順とともに徹底解説します。
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold">
            2026年最新版
          </span>
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-white/10 text-[var(--color-text-secondary)] font-medium">
            読了目安 12分
          </span>
        </div>
      </motion.div>

      <article>
        {/* ───── 7つの方法 ───── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-8 text-center">
            <FaTags className="inline text-[var(--color-accent)]" /> FANZAで安く買う7つの具体的な方法
          </h2>
          <div className="space-y-6">
            {methods.map((method, i) => (
              <motion.div
                key={method.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-sm">
                    {method.number}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--color-primary)]">
                      {method.icon}
                    </span>
                    <h3 className="font-bold text-lg">{method.title}</h3>
                  </div>
                </div>

                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
                  {method.description}
                </p>

                {/* ポイント還元率テーブル */}
                {method.table && (
                  <div className="mb-4 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-[var(--color-border)]">
                          {method.table.headers.map((h) => (
                            <th
                              key={h}
                              className="p-2 text-left font-bold"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {method.table.rows.map((row, j) => (
                          <tr
                            key={j}
                            className="border-b border-[var(--color-border)]/50 hover:bg-white/5 transition-colors"
                          >
                            <td className="p-2 font-medium">{row[0]}</td>
                            <td className="p-2 text-[var(--color-primary)] font-bold">
                              {row[1]}
                            </td>
                            <td className="p-2 text-[var(--color-text-secondary)]">
                              {row[2]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pro Tip */}
                <div className="bg-[var(--color-primary)]/5 rounded-xl p-3">
                  <h4 className="text-xs font-bold mb-1 flex items-center gap-1 text-[var(--color-primary)]">
                    <FaRegLightbulb size={12} /> Pro Tip
                  </h4>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    {method.proTip}
                  </p>
                </div>

                {/* Internal link */}
                {method.link && (
                  <a
                    href={method.link.href}
                    className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-[var(--color-accent)] hover:underline"
                  >
                    <FaCalendarAlt className="inline text-[var(--color-accent)]" /> {method.link.label} →
                  </a>
                )}

                {/* CTA after method 1 and 7 */}
                {method.cta && (
                  <div className="mt-4">
                    <PrimaryCta href={method.cta.href} size="sm">
                      {method.cta.label}
                    </PrimaryCta>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───── 節約シミュレーション ───── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🧮 年間でいくら節約できる？
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6">
            月¥5,000使っている場合のシミュレーション。7つの方法を組み合わせると、年間で約¥18,000〜30,000の節約に。
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <FaCalculator className="text-[var(--color-primary)]" size={16} />
              <h3 className="font-bold text-sm">月額出費シミュレーション</h3>
            </div>
            <div className="space-y-3">
              {savingsSimulation.map((item, i) => (
                <div key={i}>
                  <div
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      item.highlight
                        ? "bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 border border-[var(--color-primary)]/30"
                        : "bg-white/5"
                    }`}
                  >
                    <span
                      className={`text-sm ${item.highlight ? "font-bold text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"}`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        item.highlight
                          ? "text-[var(--color-primary)] text-lg"
                          : item.value.startsWith("−")
                            ? "text-green-400"
                            : "text-[var(--color-text-primary)]"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                  {i < savingsSimulation.length - 1 && !item.highlight && (
                    <div className="flex justify-center py-1">
                      <FaArrowDown
                        className="text-[var(--color-text-muted)]"
                        size={10}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-white/5 text-center">
              <p className="text-xs text-[var(--color-text-secondary)]">
                年間換算：
                <span className="font-bold text-[var(--color-primary)] text-sm ml-1">
                  約¥18,000〜30,000の節約
                </span>
                （月¥1,500〜2,500 × 12ヶ月）
              </p>
            </div>
          </motion.div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-3 text-center">
            ※ 割引率はセール時期や対象作品により変動します。上記は平均的な節約額の目安です。
          </p>
        </section>

        {/* ───── Mid CTA ───── */}
        <section className="mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-6 text-center border-[var(--color-primary)]/20"
          >
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              セールの開催スケジュールを確認して、お得なタイミングを逃さずに。
            </p>
            <PrimaryCta href={ROUTES.articleSaleCalendar} size="lg">
              年間セールカレンダーを見る
            </PrimaryCta>
          </motion.div>
        </section>

        {/* ───── FAQ ───── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            <FaQuestionCircle className="inline text-[var(--color-accent)]" /> よくある質問
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="glass-card group"
              >
                <summary className="p-5 cursor-pointer font-bold text-sm list-none flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaQuestionCircle
                      className="text-[var(--color-primary)] shrink-0"
                      size={14}
                    />
                    {faq.q}
                  </span>
                  <span className="text-[var(--color-primary)] group-open:rotate-45 transition-transform text-lg shrink-0 ml-2">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </div>
        </section>

        {/* ───── Bottom CTA ───── */}
        <section className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 border-[var(--color-primary)]/20"
          >
            <h2 className="text-2xl font-extrabold mb-4 text-center">
              <FaRocket className="inline text-[var(--color-primary)]" /> 今すぐ始めよう
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6 leading-relaxed">
              7つの節約方法が分かったら、あとは実践するだけ。
              まだFANZA未登録の方は初回クーポンで最大50%OFFからスタートできます。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <PrimaryCta href={ROUTES.guide} size="lg">
                FANZA登録ガイドを見る
              </PrimaryCta>
              <PrimaryCta href={ROUTES.sale} size="lg" variant="outline">
                今すぐセールをチェック
              </PrimaryCta>
            </div>
          </motion.div>
        </section>

        {/* ───── 関連記事リンク ───── */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-center">📚 関連記事</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={ROUTES.articleSaleCalendar}
              className="glass-card p-5 hover:border-[var(--color-primary)]/50 transition-colors block"
            >
              <h3 className="font-bold text-sm mb-1">
                <FaCalendarAlt className="inline text-[var(--color-accent)]" /> 年間セールカレンダー
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                毎週・毎月・季節ごとのセール傾向とベストタイミングを一覧で確認
              </p>
            </a>
            <a
              href={ROUTES.guide}
              className="glass-card p-5 hover:border-[var(--color-primary)]/50 transition-colors block"
            >
              <h3 className="font-bold text-sm mb-1"><FaBookOpen className="inline text-[var(--color-accent)]" /> FANZA完全ガイド</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                会員登録から購入までの流れを初心者向けに徹底解説
              </p>
            </a>
          </div>
        </section>
      </article>
    </main>
  );
}
