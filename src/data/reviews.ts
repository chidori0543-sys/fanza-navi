export interface Review {
  slug: string;
  genreSlug: string;
  productId: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  productTitle: string;
  affiliateUrl: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  heroImageUrl: string;
  heroImageAlt: string;
  ctaLabel: string;
  relatedProductIds: string[];
  body: string[];
}

const DEFAULT_REVIEW_IMAGE = "/images/ogp.svg";

export const reviews: Review[] = [
  {
    slug: "popular-series-latest-review",
    genreSlug: "popular",
    productId: "1",
    title: "人気シリーズ最新作の見どころを整理したレビュー",
    excerpt:
      "シリーズ物の最新作として、演出の安定感と特典付きの満足感を重視したい人向けの一作です。",
    publishedAt: "2026-03-29",
    updatedAt: "2026-03-29",
    productTitle: "【FANZA限定】人気シリーズ最新作 Vol.28",
    affiliateUrl: "https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=test-series-28/",
    rating: 4.7,
    reviewCount: 342,
    tags: ["シリーズ", "特典付き", "人気作"],
    heroImageUrl: DEFAULT_REVIEW_IMAGE,
    heroImageAlt: "人気シリーズ最新作のレビューイメージ",
    ctaLabel: "FANZAで作品詳細を見る",
    relatedProductIds: ["2", "3", "7"],
    body: [
      "安定したシリーズ構成で、初見でも流れを追いやすい内容です。導入から見せ場までのテンポが崩れにくく、シリーズ未経験でも置いていかれにくい仕上がりでした。",
      "特典映像があることで、通常版よりも満足度が上がりやすい構成になっています。本編だけでなく補足的なシーンまで見たい人には相性が良い一作です。",
      "シリーズのファンなら安心して選びやすく、まずは概要を把握したい人にも向いています。極端な変化球ではなく、定番の良さを堅実に積み上げたタイプとして評価できます。",
    ],
  },
  {
    slug: "vr-immersive-viewing-review",
    genreSlug: "vr",
    productId: "41",
    title: "VR作品を長く楽しむためのチェックポイント",
    excerpt:
      "没入感の高さだけでなく、視聴環境との相性まで含めて評価したVR向けレビューです。",
    publishedAt: "2026-03-26",
    updatedAt: "2026-03-26",
    productTitle: "【VR】没入体験 〜あなたのすぐそばに〜",
    affiliateUrl: "https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=test-vr-01/",
    rating: 4.6,
    reviewCount: 89,
    tags: ["VR", "没入感", "視聴環境"],
    heroImageUrl: DEFAULT_REVIEW_IMAGE,
    heroImageAlt: "VR作品レビューのイメージ",
    ctaLabel: "FANZAでVR作品を確認する",
    relatedProductIds: ["42", "43", "44"],
    body: [
      "VR作品は映像の内容だけでなく、デバイスとの相性が満足度を大きく左右します。スマホ視聴とヘッドセット視聴では印象差が大きく、最初に想定環境を決めておくことが重要です。",
      "視点のブレや距離感が気になる場合は、短時間で切り上げながら確認するのが安全です。長時間の連続視聴より、最初の15分で酔いにくさを確認する使い方が向いています。",
      "環境が合えば印象は大きく変わるため、視聴前に必要な機材を確認しておく価値があります。没入感重視で選ぶなら、価格より再生環境の相性を優先して判断したいジャンルです。",
    ],
  },
  {
    slug: "sale-selection-buying-guide",
    genreSlug: "sale",
    productId: "17",
    title: "セール対象作品を選ぶときの見方をまとめたレビュー",
    excerpt:
      "価格だけでなく、レビュー評価や収録内容のバランスを見て選びたい人向けの実用的なまとめです。",
    publishedAt: "2026-03-22",
    updatedAt: "2026-03-23",
    productTitle: "【72%OFF】春の大感謝祭セット",
    affiliateUrl: "https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=test-sale-72/",
    rating: 4.4,
    reviewCount: 234,
    tags: ["セール", "セット", "お得"],
    heroImageUrl: DEFAULT_REVIEW_IMAGE,
    heroImageAlt: "セール作品レビューのイメージ",
    ctaLabel: "セール対象作品をFANZAで見る",
    relatedProductIds: ["18", "19", "20"],
    body: [
      "セール作品は割引率だけで判断せず、収録本数やレビュー件数も見た方が失敗しにくいです。数字だけ大きく見えるセットより、用途に合う構成かどうかを先に見たいところです。",
      "セット商品は個別作品の組み合わせ次第で満足度が大きく変わるので、用途に合うかを先に確認するのが重要です。価格の安さより、何本しっかり消化できそうかを基準にすると選びやすくなります。",
      "まとめ買いの候補としては、まず評価が安定しているものから比較するのが扱いやすいです。初回のセール利用なら、レビュー件数が多い王道セットから入ると失敗しにくい印象でした。",
    ],
  },
];

export function getReviewBySlug(slug: string): Review | undefined {
  return reviews.find((review) => review.slug === slug);
}

export function getReviewByProductId(productId: string): Review | undefined {
  return reviews.find((review) => review.productId === productId);
}

export function getReviewsByGenreSlug(genreSlug: string): Review[] {
  return reviews.filter((review) => review.genreSlug === genreSlug);
}

export const reviewSlugs = reviews.map((review) => review.slug);
