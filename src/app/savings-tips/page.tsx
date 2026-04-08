import type { Metadata } from "next";
import SavingsTipsPage from "./SavingsTipsPage";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "みんなの節約術｜FANZAをもっとお得に｜FANZAトクナビ",
  description:
    "FANZAユーザーが実践する節約テクニック集。ポイント活用・セール攻略・クーポン情報など、お得に楽しむコツを共有できます。",
  path: "/savings-tips",
});

export default function Page() {
  return <SavingsTipsPage />;
}
