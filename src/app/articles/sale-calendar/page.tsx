import type { Metadata } from "next";
import SaleCalendarPage from "./SaleCalendarPage";
import { buildArticleMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = buildArticleMetadata({
  title: "FANZAセールはいつ？年間セールカレンダー【2026年最新版】",
  description:
    "FANZAのセール開催時期を年間カレンダーで徹底解説。毎週・毎月・季節の大型セールの傾向と、お得に購入するベストタイミングを紹介。",
  path: "/articles/sale-calendar",
});

export default function Page() {
  return (
    <>
      <SaleCalendarPage />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "FANZAセールはいつ？年間セールカレンダー【2026年最新版】",
        "description": "FANZAのセール開催時期を年間カレンダーで徹底解説。毎週・毎月・季節の大型セールの傾向と、お得に購入するベストタイミングを紹介。",
        "author": { "@type": "Organization", "name": "FANZAトクナビ" },
        "publisher": { "@type": "Organization", "name": "FANZAトクナビ" },
        "datePublished": "2026-04-08",
        "dateModified": "2026-04-08",
      }} />
    </>
  );
}
