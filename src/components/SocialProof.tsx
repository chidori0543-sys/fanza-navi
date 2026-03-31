"use client";

import { FaChartLine, FaTags, FaStar } from "react-icons/fa";

/**
 * サイトの特徴を表示するコンポーネント。
 * 偽のリアルタイムデータではなく、サイトの価値提案を正直に伝える。
 */
export default function SocialProof() {
  return (
    <div className="flex flex-wrap justify-center gap-6 py-4 text-sm text-[var(--color-text-secondary)]">
      <span className="flex items-center gap-2">
        <FaChartLine size={14} className="text-green-400" />
        <span>
          毎日 <strong className="text-white">自動更新</strong>
        </span>
      </span>
      <span className="flex items-center gap-2">
        <FaTags size={14} className="text-yellow-400" />
        <span>
          <strong className="text-white">6ジャンル</strong> を網羅
        </span>
      </span>
      <span className="flex items-center gap-2">
        <FaStar size={14} className="text-blue-400" />
        <span>
          FANZA公式データ連携
        </span>
      </span>
    </div>
  );
}
