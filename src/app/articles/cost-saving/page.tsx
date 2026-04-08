import type { Metadata } from "next";
import CostSavingPage from "./CostSavingPage";
import { buildArticleMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = buildArticleMetadata({
  title:
    "FANZAで安く買う7つの方法｜クーポン・セール・ポイント活用術【2026年版】",
  description:
    "FANZAで安く作品を購入する7つの具体的な方法を徹底解説。初回クーポン、週末セール、DMMポイント還元、まとめ買い割引など、知るだけで年間数万円節約できるテクニック集。",
  path: "/articles/cost-saving",
});

export default function Page() {
  return (
    <>
      <CostSavingPage />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "FANZAで安く買う7つの方法｜クーポン・セール・ポイント活用術【2026年版】",
        "description": "FANZAで安く作品を購入する7つの具体的な方法を徹底解説。初回クーポン、週末セール、DMMポイント還元、まとめ買い割引など、知るだけで年間数万円節約できるテクニック集。",
        "author": { "@type": "Organization", "name": "FANZAトクナビ" },
        "publisher": { "@type": "Organization", "name": "FANZAトクナビ" },
        "datePublished": "2026-04-08",
        "dateModified": "2026-04-08",
      }} />
    </>
  );
}
