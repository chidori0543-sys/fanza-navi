"use client";

import { FaChartLine, FaTags, FaStar } from "react-icons/fa";

/**
 * サイトの特徴を表示するコンポーネント。
 * 偽のリアルタイムデータではなく、サイトの価値提案を正直に伝える。
 */
export default function SocialProof() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="glass-card flex items-start gap-3 p-4 text-left">
        <div className="mt-1 rounded-xl bg-green-500/10 p-2 text-green-400">
          <FaChartLine size={14} />
        </div>
        <div>
          <p className="font-bold text-white">自動更新</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            月間ランキングとセール導線を見返しやすい順で整理
          </p>
        </div>
      </div>

      <div className="glass-card flex items-start gap-3 p-4 text-left">
        <div className="mt-1 rounded-xl bg-yellow-500/10 p-2 text-yellow-400">
          <FaTags size={14} />
        </div>
        <div>
          <p className="font-bold text-white">6ジャンル</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            人気作からVRまで高意図ジャンルへ最短で移動
          </p>
        </div>
      </div>

      <div className="glass-card flex items-start gap-3 p-4 text-left">
        <div className="mt-1 rounded-xl bg-blue-500/10 p-2 text-blue-400">
          <FaStar size={14} />
        </div>
        <div>
          <p className="font-bold text-white">FANZA公式データ連携</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            ランキング、レビュー、セール確認まで導線を分離
          </p>
        </div>
      </div>
    </div>
  );
}
