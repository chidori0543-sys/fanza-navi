import type { Metadata } from "next";
import NewReleasesPage from "./NewReleasesPage";

export const metadata: Metadata = {
  title: "新作リリース",
  description: "FANZAの最新リリース作品を毎日更新。注目の新作をいち早くチェック！",
};

export default function Page() {
  return <NewReleasesPage />;
}
