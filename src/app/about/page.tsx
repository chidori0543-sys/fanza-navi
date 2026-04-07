import type { Metadata } from "next";
import { FaBalanceScale, FaEnvelope, FaGlobe, FaShieldAlt } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import PrimaryCta from "@/components/PrimaryCta";
import SectionIntro from "@/components/SectionIntro";
import { buildPageMetadata } from "@/lib/metadata";
import { HAS_CANONICAL_SITE_URL, ROUTES, SITE_URL } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "運営者情報",
  description:
    "FANZAナビの運営者情報ページ。編集方針、アフィリエイト方針、お問い合わせ窓口、特定商取引法に基づく表記を掲載しています。",
  path: ROUTES.about,
});

const operatingPolicies = [
  {
    icon: <FaGlobe size={16} />,
    eyebrow: "Editorial",
    title: "比較の起点になる情報を優先",
    description:
      "ランキング、セール、レビューをバラバラに置かず、どこから見始めても次の導線が自然につながる構成を意識しています。",
  },
  {
    icon: <FaShieldAlt size={16} />,
    eyebrow: "Disclosure",
    title: "広告色を強めすぎない方針",
    description:
      "当サイトはDMMアフィリエイトを利用していますが、価格や配信状況は必ずFANZA公式サイトで最終確認してもらう前提で案内しています。",
  },
  {
    icon: <FaEnvelope size={16} />,
    eyebrow: "Contact",
    title: "誤記やリンク切れを優先対応",
    description:
      "記事内容の修正依頼やリンク切れの連絡は確認しやすい形で受け付けています。購入や返金の相談は公式窓口をご利用ください。",
  },
];

const disclosureRows = [
  {
    label: "サイト名",
    value: "FANZAナビ",
  },
  {
    label: "公開URL",
    value: HAS_CANONICAL_SITE_URL ? SITE_URL : "Cloudflare Pages の本番URL設定後に反映",
  },
  {
    label: "運営形態",
    value: "個人運営",
  },
  {
    label: "主な掲載内容",
    value: "FANZA作品のランキング、セール情報、レビュー、使い方ガイド",
  },
  {
    label: "お問い合わせ窓口",
    value: "お問い合わせページから受け付けています",
  },
];

const legalRows = [
  {
    label: "販売形態",
    value: "アフィリエイトプログラムを利用した紹介サイトです。実際の購入や契約は各提携先サイトで行われます。",
  },
  {
    label: "商品情報について",
    value: "価格、配信状況、セール条件は掲載時点の情報です。最新情報は必ずFANZA公式サイトでご確認ください。",
  },
  {
    label: "返品・キャンセル",
    value: "購入後の返品やキャンセルは各提携先サイトの規定に準じます。",
  },
  {
    label: "責任の範囲",
    value: "当サイトの情報を参考にした結果について、最終判断は利用者ご自身でお願いします。",
  },
];

export default function AboutPage() {
  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "運営者情報" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="About This Site"
          title="運営者情報"
          description="FANZA作品を比較しやすい形で整理するための方針と、アフィリエイトサイトとしての開示内容をまとめています。大げさな表現より、判断材料が増えることを優先しています。"
          action={
            <div className="flex flex-wrap gap-3">
              <PrimaryCta href={ROUTES.contact} size="sm">
                お問い合わせへ
              </PrimaryCta>
              <PrimaryCta href={ROUTES.privacy} size="sm" variant="outline">
                プライバシーポリシー
              </PrimaryCta>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          {operatingPolicies.map((policy) => (
            <section
              key={policy.title}
              className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
                {policy.icon}
              </div>
              <p className="mt-4 text-xs font-medium tracking-[0.14em] text-[var(--color-text-muted)] uppercase">
                {policy.eyebrow}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
                {policy.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                {policy.description}
              </p>
            </section>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="editorial-panel p-6 md:p-7">
          <SectionIntro
            eyebrow="Site Profile"
            title="サイトの基本情報"
            description="広告やレビューの前提を曖昧にしないために、運営形態と責任範囲を先に明記しています。"
          />
          <div className="overflow-hidden rounded-[24px] border border-[var(--color-border)]">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[var(--color-border)]">
                {disclosureRows.map((row) => (
                  <tr key={row.label}>
                    <th className="w-40 bg-[rgba(255,255,255,0.02)] px-5 py-4 text-left font-medium text-[var(--color-text-primary)]">
                      {row.label}
                    </th>
                    <td className="px-5 py-4 leading-7 text-[var(--color-text-secondary)]">
                      {row.label === "公開URL" && HAS_CANONICAL_SITE_URL ? (
                        <a href={SITE_URL} className="muted-link underline-offset-4 hover:underline">
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="editorial-surface p-6 md:p-7">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
            <FaBalanceScale size={18} />
          </div>
          <p className="mt-5 text-xs font-medium tracking-[0.14em] text-[var(--color-text-muted)] uppercase">
            Editorial Promise
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">
            先に比較軸を示してから、外部ページへ案内します。
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
            自分たちが意識しているのは、見た瞬間に買わせることではなく、作品の選び方を整えてから公式ページへ送ることです。
            レビューでは良い点だけでなく気になる点も書き、価格や配信状況は公式ページでの確認を前提にしています。
          </p>

          <div className="mt-6 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              DMM/FANZA公式への問い合わせ先
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              購入、返金、アカウント、配信状況の個別確認は、当サイトでは対応できません。
              公式サポートが必要な場合は DMM/FANZA のヘルプをご利用ください。
            </p>
            <div className="mt-5">
              <PrimaryCta
                href="https://www.dmm.com/help/"
                external
                size="sm"
                variant="outline"
              >
                DMM公式ヘルプへ
              </PrimaryCta>
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-12 editorial-panel p-6 md:p-7">
        <SectionIntro
          eyebrow="Legal Note"
          title="特定商取引法に基づく表記"
          description="アフィリエイトサイトとして、購入主体と責任範囲が誤解されないよう最低限の情報を整理しています。"
        />

        <div className="overflow-hidden rounded-[24px] border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-[var(--color-border)]">
              {legalRows.map((row) => (
                <tr key={row.label}>
                  <th className="w-44 bg-[rgba(255,255,255,0.02)] px-5 py-4 text-left font-medium text-[var(--color-text-primary)]">
                    {row.label}
                  </th>
                  <td className="px-5 py-4 leading-7 text-[var(--color-text-secondary)]">
                    {row.value}
                  </td>
                </tr>
              ))}
              <tr>
                <th className="w-44 bg-[rgba(255,255,255,0.02)] px-5 py-4 text-left font-medium text-[var(--color-text-primary)]">
                  個人情報の取り扱い
                </th>
                <td className="px-5 py-4 leading-7 text-[var(--color-text-secondary)]">
                  詳細は
                  <a href={ROUTES.privacy} className="muted-link mx-1 underline-offset-4 hover:underline">
                    プライバシーポリシー
                  </a>
                  をご確認ください。
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </main>
  );
}
