import type { Metadata } from "next";
import VRSetupPage from "./VRSetupPage";
import { buildArticleMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = buildArticleMetadata({
  title:
    "FANZA VR動画の視聴方法｜スマホ・PC・Meta Questデバイス別セットアップ完全ガイド",
  description:
    "FANZA VR動画をスマホ・Meta Quest 2/3・PC・PSVR2で視聴する方法をデバイス別に完全解説。必要な機材、セットアップ手順、画質設定、トラブル対処法まで網羅。",
  path: ROUTES.articleVrSetup,
});

export default function Page() {
  return (
    <>
      <VRSetupPage />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "FANZA VR動画の視聴方法｜スマホ・PC・Meta Questデバイス別セットアップ完全ガイド",
        "description": "FANZA VR動画をスマホ・Meta Quest 2/3・PC・PSVR2で視聴する方法をデバイス別に完全解説。必要な機材、セットアップ手順、画質設定、トラブル対処法まで網羅。",
        "author": { "@type": "Organization", "name": "FANZAトクナビ" },
        "publisher": { "@type": "Organization", "name": "FANZAトクナビ" },
        "datePublished": "2026-04-08",
        "dateModified": "2026-04-08",
      }} />
    </>
  );
}
