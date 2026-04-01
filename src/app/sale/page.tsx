import type { Metadata } from "next";
import SalePage from "./SalePage";

export const metadata: Metadata = {
  title: "セール・キャンペーン",
  description: "FANZAのお得なセール・キャンペーン情報をお届け。FANZA API連携後にリアルタイムで更新予定。",
};

export default function Page() {
  return <SalePage />;
}
