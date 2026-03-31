export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  affiliateUrl: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  genre: string;
  tags: string[];
  rank?: number;
  isNew?: boolean;
  isSale?: boolean;
  releaseDate: string;
}

export interface Genre {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// ジャンル定義
export const genres: Genre[] = [
  {
    id: "popular",
    name: "人気作品",
    icon: "🔥",
    description: "今最も売れている人気作品",
    color: "#e4007f",
  },
  {
    id: "new-release",
    name: "新作",
    icon: "✨",
    description: "最新リリースの注目作品",
    color: "#ff6b35",
  },
  {
    id: "sale",
    name: "セール",
    icon: "💰",
    description: "お得なセール・キャンペーン中",
    color: "#ffd700",
  },
  {
    id: "high-rated",
    name: "高評価",
    icon: "⭐",
    description: "ユーザー評価4.5以上の名作",
    color: "#34d399",
  },
  {
    id: "amateur",
    name: "素人",
    icon: "📹",
    description: "素人系の人気作品",
    color: "#60a5fa",
  },
  {
    id: "vr",
    name: "VR",
    icon: "🥽",
    description: "没入感抜群のVR作品",
    color: "#a78bfa",
  },
];

// サンプルデータ（実際にはDMM APIから取得）
export const sampleProducts: Product[] = [
  {
    id: "1",
    title: "【FANZA限定】人気シリーズ最新作 Vol.28",
    description: "大人気シリーズの最新作が遂に登場。FANZA限定の特典映像付き。",
    imageUrl: "/placeholder-1.jpg",
    affiliateUrl: "#",
    price: 2480,
    salePrice: 1480,
    rating: 4.7,
    reviewCount: 342,
    genre: "popular",
    tags: ["限定", "シリーズ", "特典付き"],
    rank: 1,
    isSale: true,
    releaseDate: "2026-03-28",
  },
  {
    id: "2",
    title: "デビュー作品 〜期待の新人〜",
    description: "注目の新人による衝撃のデビュー作。圧倒的なクオリティで話題沸騰中。",
    imageUrl: "/placeholder-2.jpg",
    affiliateUrl: "#",
    price: 1980,
    rating: 4.8,
    reviewCount: 156,
    genre: "new-release",
    tags: ["デビュー", "新人", "話題"],
    rank: 2,
    isNew: true,
    releaseDate: "2026-03-30",
  },
  {
    id: "3",
    title: "殿堂入り名作コレクション Remastered",
    description: "歴代売上TOP作品がリマスター版で復活。高画質で蘇る不朽の名作。",
    imageUrl: "/placeholder-3.jpg",
    affiliateUrl: "#",
    price: 3480,
    salePrice: 980,
    rating: 4.9,
    reviewCount: 1205,
    genre: "high-rated",
    tags: ["殿堂入り", "リマスター", "名作"],
    rank: 3,
    isSale: true,
    releaseDate: "2026-02-14",
  },
  {
    id: "4",
    title: "【VR】没入体験 〜あなたのすぐそばに〜",
    description: "最新VR技術で実現する究極の没入体験。8K高画質対応。",
    imageUrl: "/placeholder-4.jpg",
    affiliateUrl: "#",
    price: 2980,
    rating: 4.6,
    reviewCount: 89,
    genre: "vr",
    tags: ["VR", "8K", "没入体験"],
    rank: 4,
    isNew: true,
    releaseDate: "2026-03-25",
  },
  {
    id: "5",
    title: "素人初撮りドキュメント Vol.103",
    description: "リアルなドキュメンタリー形式で贈る大人気素人シリーズ。",
    imageUrl: "/placeholder-5.jpg",
    affiliateUrl: "#",
    price: 1480,
    rating: 4.5,
    reviewCount: 678,
    genre: "amateur",
    tags: ["素人", "ドキュメント", "リアル"],
    rank: 5,
    releaseDate: "2026-03-20",
  },
  {
    id: "6",
    title: "【72%OFF】春の大感謝祭セット",
    description: "人気作品5本セットが驚きの72%OFF。期間限定の超お得パック。",
    imageUrl: "/placeholder-6.jpg",
    affiliateUrl: "#",
    price: 9800,
    salePrice: 2780,
    rating: 4.4,
    reviewCount: 234,
    genre: "sale",
    tags: ["セット", "72%OFF", "期間限定"],
    rank: 6,
    isSale: true,
    releaseDate: "2026-03-15",
  },
];
