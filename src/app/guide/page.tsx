import type { Metadata } from "next";
import GuidePage from "./GuidePage";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { buildAffiliateUrl } from "@/lib/affiliate";

export const metadata: Metadata = buildPageMetadata({
  title:
    "FANZA完全ガイド｜登録方法・支払い方法・お得な買い方を徹底解説【2025年最新】",
  description:
    "FANZAの無料登録方法、支払い方法の比較、お得なクーポン活用術まで徹底解説。初めてFANZAを使う方も安心の完全ガイド。VR視聴方法や月額見放題の比較も。",
  path: ROUTES.guide,
});

export default function Page() {
  const affiliateUrl = buildAffiliateUrl("https://www.dmm.co.jp/digital/videoa/");
  return (
    <>
      <GuidePage affiliateUrl={affiliateUrl} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "FANZA完全ガイド｜登録方法・支払い方法・お得な買い方を徹底解説【2025年最新】",
        "description": "FANZAの無料登録方法、支払い方法の比較、お得なクーポン活用術まで徹底解説。初めてFANZAを使う方も安心の完全ガイド。VR視聴方法や月額見放題の比較も。",
        "author": { "@type": "Organization", "name": "FANZAトクナビ" },
        "publisher": { "@type": "Organization", "name": "FANZAトクナビ" },
        "datePublished": "2026-04-08",
        "dateModified": "2026-04-08",
      }} />
    </>
  );
}
