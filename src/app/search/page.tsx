import type { Metadata } from "next";
import SearchPage from "./SearchPage";

export const metadata: Metadata = {
  title: "作品検索",
  description: "FANZA作品をキーワードで検索。お気に入りの作品を見つけよう。",
};

export default function Page() {
  return <SearchPage />;
}
