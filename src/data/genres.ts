import { genres as productGenres } from "@/data/products";

export interface GenreLandingPage {
  slug: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  headline: string;
  intro: string;
  highlight: string;
  articleId?: string;
  featuredReviewSlugs: string[];
}

const genreRouteCopy: Record<
  string,
  Pick<GenreLandingPage, "headline" | "intro" | "highlight" | "featuredReviewSlugs" | "articleId">
> = {
  popular: {
    headline: "人気作品の傾向とレビューをまとめて確認",
    intro:
      "売れ筋の定番を見比べたい人向けに、安定感のあるシリーズ作や高評価タイトルをまとめています。",
    highlight: "迷ったら、まずはレビュー経由で作風と特典の傾向を把握するのが安全です。",
    featuredReviewSlugs: ["popular-series-latest-review"],
  },
  "new-release": {
    headline: "新作の注目ポイントを短時間で見つける",
    intro:
      "配信開始が近い作品を中心に、初回セールの有無やレビュー件数の伸びやすさを見ながら選べる構成です。",
    highlight: "新作は配信直後に動きやすいので、価格と初期評価の両方を見ておくと判断しやすくなります。",
    featuredReviewSlugs: [],
  },
  sale: {
    headline: "割引率だけで終わらないセール選び",
    intro:
      "セット本数、通常価格との差、レビュー件数を並べて確認しやすいようにセール作品を整理しています。",
    highlight: "大幅値引きでも中身との相性が重要なので、用途に近いレビューから入るのがおすすめです。",
    featuredReviewSlugs: ["sale-selection-buying-guide"],
  },
  "high-rated": {
    headline: "満足度を優先して高評価作品を比較",
    intro:
      "評価4.5以上の作品を中心に、レビュー件数と価格帯のバランスを見ながら選びやすくしています。",
    highlight: "迷ったら評価点だけでなく、レビュー件数が十分ある作品を優先すると外しにくくなります。",
    featuredReviewSlugs: [],
  },
  amateur: {
    headline: "素人系の定番作品を探しやすく整理",
    intro:
      "ドキュメント調やナンパ系など、素人ジャンルでも方向性が違う作品を見分けやすいように並べています。",
    highlight: "作風の幅が広いジャンルなので、タグと説明文を先に拾うと好みとのズレを減らせます。",
    featuredReviewSlugs: [],
  },
  vr: {
    headline: "VR作品の相性をレビューと一緒に確認",
    intro:
      "没入感だけでなく視聴環境も含めて比較しやすいよう、VR定番作品をまとめています。",
    highlight: "視聴環境を整えてから選ぶと満足度が上がりやすいので、まずはレビューでチェックポイントを確認してください。",
    featuredReviewSlugs: ["vr-immersive-viewing-review"],
  },
  mature: {
    headline: "大人の魅力あふれる熟女作品を厳選",
    intro:
      "経験と色気を兼ね備えた人気女優の作品を中心に、満足度の高いタイトルを並べています。",
    highlight: "熟女ジャンルは出演女優の幅が広いので、レビューで作風を確認してから選ぶのがおすすめです。",
    featuredReviewSlugs: [],
  },
  busty: {
    headline: "巨乳ジャンルの人気作品を比較",
    intro:
      "スタイル重視の作品から、演技力も兼ね備えた人気女優の作品まで幅広く整理しています。",
    highlight: "人気女優の定番作品から入ると失敗しにくいです。",
    featuredReviewSlugs: [],
  },
  planning: {
    headline: "企画系作品のユニークな発想を楽しむ",
    intro:
      "バラエティ要素やユニークな設定が特徴の企画系作品を集めています。",
    highlight: "企画系はタイトルだけでは読めないので、レビューで実際の内容を確認するのが安全です。",
    featuredReviewSlugs: [],
  },
  drama: {
    headline: "ストーリー重視のドラマ作品を厳選",
    intro:
      "演技力と脚本にこだわったドラマ仕立ての作品を見比べやすく整理しています。",
    highlight: "ストーリー重視派は収録時間の長い作品から選ぶと満足度が高くなりやすいです。",
    featuredReviewSlugs: [],
  },
  cosplay: {
    headline: "コスプレ衣装が魅力の作品を探す",
    intro:
      "制服・ナース・メイドなど、衣装にこだわったコスプレ作品をまとめています。",
    highlight: "好みの衣装ジャンルから入ると、効率よくお気に入りが見つかります。",
    featuredReviewSlugs: [],
  },
  idol: {
    headline: "アイドル系女優の注目作品を比較",
    intro:
      "ルックス重視のアイドル系女優が出演する作品を人気順で整理しています。",
    highlight: "話題の新人アイドルはデビュー作から追うと、成長が追えて楽しめます。",
    featuredReviewSlugs: [],
  },
};

export const genrePages: GenreLandingPage[] = productGenres.map((genre) => ({
  slug: genre.id,
  name: genre.name,
  icon: genre.icon,
  color: genre.color,
  description: genre.description,
  headline: genreRouteCopy[genre.id]?.headline ?? genre.description,
  intro: genreRouteCopy[genre.id]?.intro ?? genre.description,
  highlight: genreRouteCopy[genre.id]?.highlight ?? genre.description,
  articleId: genreRouteCopy[genre.id]?.articleId,
  featuredReviewSlugs: genreRouteCopy[genre.id]?.featuredReviewSlugs ?? [],
}));

export const genreSlugs = genrePages.map((genre) => genre.slug);

export function getGenreBySlug(slug: string): GenreLandingPage | undefined {
  return genrePages.find((genre) => genre.slug === slug);
}
