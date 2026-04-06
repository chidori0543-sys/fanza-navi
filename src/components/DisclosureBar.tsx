const DISCLOSURE_TEXT =
  "当サイトはDMMアフィリエイトを利用しています。商品情報・価格は記事執筆時点のものです。最新の価格・配信状況はFANZA公式サイトでご確認ください。";

export default function DisclosureBar() {
  return (
    <div className="border-b border-[var(--color-border)] bg-[#1a1a2e] px-4 py-2 text-center text-[11px] leading-relaxed text-[var(--color-text-secondary)]">
      {DISCLOSURE_TEXT}
    </div>
  );
}
