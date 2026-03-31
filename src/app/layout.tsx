import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FANZAおすすめ作品ナビ | 人気ランキング＆レビュー",
  description:
    "FANZAの人気作品をジャンル別にランキング形式で紹介。厳選レビューとお得なセール情報も毎日更新中。",
  keywords: ["FANZA", "DMM", "おすすめ", "ランキング", "レビュー", "セール"],
  openGraph: {
    title: "FANZAおすすめ作品ナビ",
    description: "FANZAの人気作品をジャンル別にランキング形式で紹介",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
