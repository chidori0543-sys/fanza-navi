import type { Metadata } from "next";
import SalePage from "./SalePage";

export const metadata: Metadata = {
  title: "セール・キャンペーン",
  description: "FANZAのお得なセール・キャンペーン情報まとめ。最大80%OFFの作品も！",
};

export default function Page() {
  return <SalePage />;
}
