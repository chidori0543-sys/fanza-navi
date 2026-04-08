"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPiggyBank,
  FaLightbulb,
  FaThumbsUp,
  FaFilter,
  FaSortAmountDown,
  FaPaperPlane,
  FaTimes,
  FaChevronDown,
  FaStar,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Category = "クーポン" | "ポイント" | "セール" | "見放題" | "その他";
type Difficulty = "簡単" | "普通" | "上級者向け";

interface SavingsTip {
  id: string;
  title: string;
  description: string;
  estimatedSavings: string;
  difficulty: Difficulty;
  category: Category;
  likes: number;
  isUserSubmitted?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Pre-populated tips                                                 */
/* ------------------------------------------------------------------ */

const DEFAULT_TIPS: SavingsTip[] = [
  {
    id: "tip-1",
    title: "ポイント10倍デーを狙う",
    description:
      "毎月特定日にDMMポイント10倍キャンペーンが開催されます。通常1%還元が10%に。¥3,000の作品なら300ポイントも獲得できるので、高額作品ほどお得。カレンダーにチェックしておきましょう。",
    estimatedSavings: "¥300〜¥1,500/月",
    difficulty: "簡単",
    category: "ポイント",
    likes: 156,
  },
  {
    id: "tip-2",
    title: "まとめ買いセールを活用",
    description:
      "3本以上の同時購入で追加割引が適用されるセールが定期的に開催されます。単品で30%OFFの作品が、まとめ買いでさらに10%OFFになることも。欲しいものリストに溜めておいてセール時に一気買いがコツ。",
    estimatedSavings: "¥500〜¥3,000/回",
    difficulty: "簡単",
    category: "セール",
    likes: 142,
  },
  {
    id: "tip-3",
    title: "クーポンページを毎日チェック",
    description:
      "FANZAでは不定期にクーポンが配布されます。ログイン後のクーポンページを毎日確認する習慣をつけましょう。特に週末や月末は配布頻度が高く、¥500〜¥1,000OFFクーポンが出ることも。",
    estimatedSavings: "¥500〜¥1,000/月",
    difficulty: "簡単",
    category: "クーポン",
    likes: 138,
  },
  {
    id: "tip-4",
    title: "セール終了間際に買う",
    description:
      "セール期間中、終了間際に追加値下げされることがあります。特にまとめ買いセールの最終日は割引率が上がる傾向。ただし売り切れリスクもあるので、人気作品は早めの購入が安全。",
    estimatedSavings: "¥200〜¥800/回",
    difficulty: "普通",
    category: "セール",
    likes: 89,
  },
  {
    id: "tip-5",
    title: "月額見放題のお試し期間を活用",
    description:
      "月額見放題チャンネルには無料お試し期間があります。初月は実質無料で多数の作品を視聴可能。気に入らなければ期間内に解約すれば料金はかかりません。複数チャンネルを順番にお試しするのもアリ。",
    estimatedSavings: "¥2,980/月",
    difficulty: "簡単",
    category: "見放題",
    likes: 201,
  },
  {
    id: "tip-6",
    title: "DMMプリペイドカードをコンビニで購入",
    description:
      "コンビニで購入できるDMMプリペイドカードは、キャンペーン時に割増ポイントが付くことがあります。通常¥3,000で3,000ポイントのところ、3,300ポイント付与など。コンビニの決済キャンペーンと併用も可能。",
    estimatedSavings: "¥150〜¥500/回",
    difficulty: "普通",
    category: "ポイント",
    likes: 78,
  },
  {
    id: "tip-7",
    title: "年末年始セールに予算を確保",
    description:
      "年間最大のセールは12月末〜1月初旬。50〜70%OFFの大幅割引が実施されます。年間の購入予算をここに集中させるだけで、同じ作品数でも数千円の節約に。福袋企画も見逃せません。",
    estimatedSavings: "¥3,000〜¥10,000/年",
    difficulty: "普通",
    category: "セール",
    likes: 167,
  },
  {
    id: "tip-8",
    title: "ウィッシュリスト機能を活用",
    description:
      "気になる作品はすぐに購入せず、ウィッシュリストに追加しましょう。セール時にリスト内の作品が値下げされた場合に通知が届くこともあります。衝動買いを防ぎつつ、最安値で購入できます。",
    estimatedSavings: "¥1,000〜¥3,000/月",
    difficulty: "簡単",
    category: "その他",
    likes: 95,
  },
  {
    id: "tip-9",
    title: "レビュー投稿でポイントを貯める",
    description:
      "購入した作品にレビューを投稿すると、DMMポイントが付与されます。1レビューあたり数十ポイントですが、積み重ねると月に数百ポイントに。作品を楽しんだ後のルーティンにしましょう。",
    estimatedSavings: "¥100〜¥500/月",
    difficulty: "簡単",
    category: "ポイント",
    likes: 63,
  },
  {
    id: "tip-10",
    title: "複数の決済方法を比較",
    description:
      "クレジットカード、電子マネー、コンビニ払いなど、決済方法によってポイント還元率が異なります。高還元率のクレジットカード（2%以上）を使えば、それだけで節約に。DMMポイントとの二重取りも可能。",
    estimatedSavings: "¥200〜¥600/月",
    difficulty: "普通",
    category: "ポイント",
    likes: 72,
  },
  {
    id: "tip-11",
    title: "見放題チャンネルの入れ替えタイミングを把握",
    description:
      "月額見放題の作品は定期的に入れ替わります。退出予定の作品は月末までに視聴し、新着作品を月初にチェック。これにより見逃しを防ぎ、月額料金分を最大限に活用できます。",
    estimatedSavings: "¥1,000〜¥2,000/月",
    difficulty: "普通",
    category: "見放題",
    likes: 84,
  },
  {
    id: "tip-12",
    title: "初回限定クーポンを最大活用",
    description:
      "FANZA初回利用時に配布される高額クーポン（¥1,000〜¥2,000OFF）は最も価値が高い。このクーポンは高額商品に使うのが鉄則。¥5,000以上の作品に適用すれば実質40%OFF以上に。",
    estimatedSavings: "¥1,000〜¥2,000/回",
    difficulty: "簡単",
    category: "クーポン",
    likes: 193,
  },
  {
    id: "tip-13",
    title: "GW・夏ボーナス時期のまとめ買い",
    description:
      "GW（4/29〜5/5）と夏ボーナス時期（7月上旬）は大規模セールの定番。年2回のビッグセールとして予算を分配し、この期間に集中購入すると年間で大きな節約になります。",
    estimatedSavings: "¥2,000〜¥5,000/回",
    difficulty: "普通",
    category: "セール",
    likes: 111,
  },
  {
    id: "tip-14",
    title: "VR作品はセット購入がお得",
    description:
      "VR作品は単価が高めですが、メーカーセットやシリーズセットで購入すると30〜50%OFFになることが多いです。VRデバイスの初期投資はありますが、長期的にはコスパ良好。",
    estimatedSavings: "¥1,500〜¥4,000/回",
    difficulty: "上級者向け",
    category: "セール",
    likes: 67,
  },
  {
    id: "tip-15",
    title: "ポイント有効期限を管理する",
    description:
      "DMMポイントには有効期限があります。期限切れで失効させてしまうのは最大のムダ。月に1回はポイント残高と期限を確認し、期限が近いものから優先的に使いましょう。",
    estimatedSavings: "¥200〜¥1,000/月",
    difficulty: "簡単",
    category: "ポイント",
    likes: 88,
  },
  {
    id: "tip-16",
    title: "メーカー公式セールを見逃さない",
    description:
      "各メーカーが独自にセールを実施することがあります。お気に入りメーカーのページをブックマークして定期チェック。全体セールとタイミングがずれるため、ライバルが少なく品切れも少ないです。",
    estimatedSavings: "¥500〜¥2,000/回",
    difficulty: "上級者向け",
    category: "セール",
    likes: 54,
  },
  {
    id: "tip-17",
    title: "同人作品で掘り出し物を見つける",
    description:
      "同人作品は¥100〜¥500と低価格帯が多く、セール時はさらに安くなります。大手メーカー作品と比べて単価が安いため、多くの作品を楽しみたい方にはコスパ抜群の選択肢です。",
    estimatedSavings: "¥1,000〜¥3,000/月",
    difficulty: "普通",
    category: "その他",
    likes: 76,
  },
  {
    id: "tip-18",
    title: "月額見放題+単品購入のハイブリッド戦略",
    description:
      "月額見放題で幅広いジャンルをカバーしつつ、本当に気に入った作品だけ単品購入するハイブリッド戦略が最もコスパが高い。見放題で試聴→厳選して購入、の流れで無駄遣いを削減。",
    estimatedSavings: "¥2,000〜¥5,000/月",
    difficulty: "上級者向け",
    category: "見放題",
    likes: 124,
  },
];

const CATEGORIES: Category[] = [
  "クーポン",
  "ポイント",
  "セール",
  "見放題",
  "その他",
];

type SortKey = "savings" | "popular" | "difficulty";

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  簡単: 1,
  普通: 2,
  上級者向け: 3,
};

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  簡単: "#22c55e",
  普通: "#f59e0b",
  上級者向け: "#ef4444",
};

/* ------------------------------------------------------------------ */
/*  localStorage helpers                                               */
/* ------------------------------------------------------------------ */

const LIKES_KEY = "fanza-tips-likes";
const USER_TIPS_KEY = "fanza-user-tips";

function loadLikes(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LIKES_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveLikes(data: Record<string, boolean>) {
  localStorage.setItem(LIKES_KEY, JSON.stringify(data));
}

function loadUserTips(): SavingsTip[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USER_TIPS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUserTips(tips: SavingsTip[]) {
  localStorage.setItem(USER_TIPS_KEY, JSON.stringify(tips));
}

/* ------------------------------------------------------------------ */
/*  Tip Card component                                                 */
/* ------------------------------------------------------------------ */

function TipCard({
  tip,
  isLiked,
  onLike,
  extraLikes,
}: {
  tip: SavingsTip;
  isLiked: boolean;
  onLike: () => void;
  extraLikes: number;
}) {
  const totalLikes = tip.likes + extraLikes;
  return (
    <motion.div
      className="glass-card p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <FaLightbulb size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              {tip.title}
            </h3>
            {tip.isUserSubmitted && (
              <span className="rounded-full bg-[var(--color-accent)]/20 px-2 py-0.5 text-[10px] font-medium text-[var(--color-accent)]">
                投稿
              </span>
            )}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
            {tip.description}
          </p>

          {/* Meta info */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-primary)]">
              <FaPiggyBank className="mr-1 inline text-[var(--color-primary)]" size={10} />
              {tip.estimatedSavings}
            </span>
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-medium text-white"
              style={{ backgroundColor: DIFFICULTY_COLOR[tip.difficulty] }}
            >
              {tip.difficulty}
            </span>
            <span className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[11px] text-[var(--color-text-muted)]">
              {tip.category}
            </span>
          </div>

          {/* Like button */}
          <div className="mt-3 flex items-center">
            <button
              onClick={onLike}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                isLiked
                  ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                  : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
              }`}
            >
              <FaThumbsUp size={12} />
              <span>{totalLikes}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Submit Form component                                              */
/* ------------------------------------------------------------------ */

function SubmitForm({
  onSubmit,
  onClose,
}: {
  onSubmit: (tip: SavingsTip) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [savings, setSavings] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("簡単");
  const [category, setCategory] = useState<Category>("その他");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const tip: SavingsTip = {
      id: `user-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      estimatedSavings: savings.trim() || "不明",
      difficulty,
      category,
      likes: 0,
      isUserSubmitted: true,
    };
    onSubmit(tip);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-card overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
        <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-primary)]">
          <FaPaperPlane className="text-[var(--color-primary)]" size={14} />
          あなたの節約術を投稿
        </h3>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-white"
        >
          <FaTimes size={14} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
            タイトル <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: ポイント10倍デーを狙う"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
            詳しい説明 <span className="text-red-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="具体的なやり方やポイントを教えてください..."
            rows={4}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
              節約効果
            </label>
            <input
              type="text"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              placeholder="¥1,000/月"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
              難易度
            </label>
            <div className="relative">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 pr-8 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
              >
                <option value="簡単">簡単</option>
                <option value="普通">普通</option>
                <option value="上級者向け">上級者向け</option>
              </select>
              <FaChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                size={10}
              />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
              カテゴリ
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 pr-8 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <FaChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                size={10}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--color-primary)] py-3 text-sm font-bold text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          disabled={!title.trim() || !description.trim()}
        >
          投稿する
        </button>
      </form>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function SavingsTipsPage() {
  const [mounted, setMounted] = useState(false);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [userTips, setUserTips] = useState<SavingsTip[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("popular");

  useEffect(() => {
    setLikes(loadLikes());
    setUserTips(loadUserTips());
    setMounted(true);
  }, []);

  const toggleLike = useCallback((tipId: string) => {
    setLikes((prev) => {
      const next = { ...prev, [tipId]: !prev[tipId] };
      saveLikes(next);
      return next;
    });
  }, []);

  const handleSubmit = useCallback((tip: SavingsTip) => {
    setUserTips((prev) => {
      const next = [tip, ...prev];
      saveUserTips(next);
      return next;
    });
    setShowForm(false);
  }, []);

  const allTips = useMemo(
    () => [...userTips, ...DEFAULT_TIPS],
    [userTips]
  );

  const filteredAndSorted = useMemo(() => {
    let result =
      activeCategory === "all"
        ? allTips
        : allTips.filter((t) => t.category === activeCategory);

    switch (sortKey) {
      case "popular":
        result = [...result].sort(
          (a, b) =>
            b.likes +
            (likes[b.id] ? 1 : 0) -
            (a.likes + (likes[a.id] ? 1 : 0))
        );
        break;
      case "savings": {
        const parseSavings = (s: string) => {
          const m = s.match(/[\d,]+/);
          return m ? parseInt(m[0].replace(/,/g, "")) : 0;
        };
        result = [...result].sort(
          (a, b) => parseSavings(b.estimatedSavings) - parseSavings(a.estimatedSavings)
        );
        break;
      }
      case "difficulty":
        result = [...result].sort(
          (a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
        );
        break;
    }

    return result;
  }, [allTips, activeCategory, sortKey, likes]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { all: allTips.length };
    for (const c of CATEGORIES) {
      stats[c] = allTips.filter((t) => t.category === c).length;
    }
    return stats;
  }, [allTips]);

  return (
    <main className="content-shell px-4 py-6">
      <Breadcrumb items={[{ label: "みんなの節約術" }]} />

      {/* Hero */}
      <section className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-xs text-[var(--color-text-secondary)]">
            <FaPiggyBank size={12} className="text-[var(--color-primary)]" />
            節約テクニック集
          </div>
          <h1 className="gradient-text text-2xl font-black md:text-3xl">
            みんなの節約術
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-text-secondary)]">
            FANZAユーザーが実践する節約テクニックを集めました。
            ポイント・クーポン・セール活用術であなたもお得に楽しもう。
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      {mounted && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-6 p-5"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-[var(--color-primary)]">
                {allTips.length}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                節約術の数
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-[var(--color-accent)]">
                {CATEGORIES.length}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                カテゴリ
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-green-400">
                {Object.values(likes).filter(Boolean).length}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                いいね済み
              </p>
            </div>
          </div>
        </motion.section>
      )}

      {/* Filter & Sort */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 space-y-3"
      >
        {/* Category filter */}
        <div className="flex items-center gap-2">
          <FaFilter
            size={11}
            className="shrink-0 text-[var(--color-text-muted)]"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-[var(--color-primary)] text-white"
                  : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-white"
              }`}
            >
              すべて ({categoryStats.all})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-white"
                }`}
              >
                {cat} ({categoryStats[cat] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <FaSortAmountDown
            size={11}
            className="shrink-0 text-[var(--color-text-muted)]"
          />
          <div className="flex gap-2">
            {[
              { key: "popular" as SortKey, label: "人気順" },
              { key: "savings" as SortKey, label: "節約効果順" },
              { key: "difficulty" as SortKey, label: "難易度順" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSortKey(key)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
                  sortKey === key
                    ? "bg-[var(--color-accent)] text-white"
                    : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Submit button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border-strong)] py-4 text-sm font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <FaPaperPlane size={14} />
            あなたの節約術を投稿する
          </button>
        )}
        <AnimatePresence>
          {showForm && (
            <SubmitForm
              onSubmit={handleSubmit}
              onClose={() => setShowForm(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tips list */}
      <section className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredAndSorted.map((tip, idx) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.03 }}
              layout
            >
              <TipCard
                tip={tip}
                isLiked={!!likes[tip.id]}
                onLike={() => toggleLike(tip.id)}
                extraLikes={likes[tip.id] ? 1 : 0}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAndSorted.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
            該当する節約術がありません
          </div>
        )}
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 rounded-2xl border border-[var(--color-primary)]/20 bg-gradient-to-r from-[var(--color-primary)]/8 to-[var(--color-accent)]/5 p-6 text-center"
      >
        <FaStar
          className="mx-auto mb-3 text-[var(--color-primary)]"
          size={28}
        />
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          もっとお得に楽しむなら
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          セール情報やシミュレーターも活用して、最大限に節約しよう。
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a
            href="/sale"
            className="inline-block rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-80"
          >
            セール情報を見る
          </a>
          <a
            href="/simulator"
            className="inline-block rounded-xl border border-[var(--color-border-strong)] px-6 py-2.5 text-sm font-bold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface)]"
          >
            お得度シミュレーター
          </a>
        </div>
      </motion.section>
    </main>
  );
}
