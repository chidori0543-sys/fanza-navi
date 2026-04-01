import type { Metadata } from "next";
import ContactPage from "./ContactPage";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "FANZAおすすめ作品ナビへのお問い合わせはこちら。記事内容の誤りの報告やサイトに関するご意見をお待ちしています。",
};

export default function Page() {
  return <ContactPage />;
}
