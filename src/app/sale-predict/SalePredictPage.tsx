"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaChartBar,
  FaBell,
  FaChevronLeft,
  FaChevronRight,
  FaFire,
  FaPercentage,
  FaGift,
  FaSnowflake,
  FaSun,
  FaTag,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";

/* ------------------------------------------------------------------ */
/*  Types & constants                                                  */
/* ------------------------------------------------------------------ */

interface SalePeriod {
  name: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  discount: string;
  strategy: string;
  category: "monthly" | "seasonal" | "annual";
  color: string;
}

const MONTHLY_SALES: Omit<SalePeriod, "startMonth" | "endMonth">[] = [
  {
    name: "月初セール",
    startDay: 1,
    endDay: 3,
    discount: "20〜40%OFF",
    strategy: "月替わり直後が狙い目。前月の売れ残り作品が大幅値下げされることが多い。",
    category: "monthly",
    color: "var(--color-primary)",
  },
  {
    name: "月中セール",
    startDay: 15,
    endDay: 17,
    discount: "15〜30%OFF",
    strategy: "特定ジャンルに絞った限定セールが多い。ジャンルページを要チェック。",
    category: "monthly",
    color: "var(--color-accent)",
  },
  {
    name: "月末セール",
    startDay: 25,
    endDay: 31,
    discount: "30〜50%OFF",
    strategy: "月内最大の割引率。まとめ買い割引と併用で最大効果。欲しいものリストの作品を一気に購入。",
    category: "monthly",
    color: "#22c55e",
  },
];

const SEASONAL_SALES: SalePeriod[] = [
  {
    name: "GWセール",
    startMonth: 4,
    startDay: 29,
    endMonth: 5,
    endDay: 5,
    discount: "30〜50%OFF",
    strategy: "大型連休はまとめ買いのチャンス。VR作品もセール対象になりやすい。",
    category: "seasonal",
    color: "#f59e0b",
  },
  {
    name: "夏のボーナスセール",
    startMonth: 7,
    startDay: 1,
    endMonth: 7,
    endDay: 15,
    discount: "40〜60%OFF",
    strategy: "年間でもトップクラスの割引率。高額作品はこの時期に買うのがベスト。",
    category: "seasonal",
    color: "#ef4444",
  },
  {
    name: "バレンタインセール",
    startMonth: 2,
    startDay: 10,
    endMonth: 2,
    endDay: 14,
    discount: "20〜40%OFF",
    strategy: "女性向けジャンルが特に安くなる。限定クーポンも配布されやすい。",
    category: "seasonal",
    color: "#ec4899",
  },
  {
    name: "年末年始セール",
    startMonth: 12,
    startDay: 20,
    endMonth: 1,
    endDay: 5,
    discount: "50〜70%OFF",
    strategy: "年間最大のセール。福袋企画もあり。予算を確保しておくのが最大の節約術。",
    category: "seasonal",
    color: "#8b5cf6",
  },
];

const ANNUAL_SALES: SalePeriod[] = [
  {
    name: "FANZA周年記念セール",
    startMonth: 8,
    startDay: 1,
    endMonth: 8,
    endDay: 31,
    discount: "40〜70%OFF",
    strategy: "8月はFANZA設立記念月。全ジャンル対象の大規模セールが開催される。",
    category: "annual",
    color: "#f97316",
  },
  {
    name: "ブラックフライデー",
    startMonth: 11,
    startDay: 22,
    endMonth: 11,
    endDay: 28,
    discount: "30〜60%OFF",
    strategy: "11月最終金曜周辺。海外発祥だが国内でも定着。電子書籍が特に安い。",
    category: "annual",
    color: "#1e293b",
  },
];

const DAYS_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"] as const;
const MONTH_NAMES = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function getSalesForDate(
  year: number,
  month: number,
  day: number
): SalePeriod[] {
  const results: SalePeriod[] = [];
  const m = month + 1; // 1-indexed
  const daysInMonth = getDaysInMonth(year, month);

  // Monthly sales (apply to every month)
  for (const sale of MONTHLY_SALES) {
    const endDay = Math.min(sale.endDay, daysInMonth);
    if (day >= sale.startDay && day <= endDay) {
      results.push({
        ...sale,
        startMonth: m,
        endMonth: m,
      });
    }
  }

  // Seasonal + Annual sales
  for (const sale of [...SEASONAL_SALES, ...ANNUAL_SALES]) {
    if (sale.startMonth === sale.endMonth) {
      if (m === sale.startMonth && day >= sale.startDay && day <= sale.endDay) {
        results.push(sale);
      }
    } else {
      // Cross-month sale
      if (m === sale.startMonth && day >= sale.startDay) {
        results.push(sale);
      } else if (m === sale.endMonth && day <= sale.endDay) {
        results.push(sale);
      }
    }
  }

  return results;
}

function getCategoryIcon(category: SalePeriod["category"]) {
  switch (category) {
    case "monthly":
      return <FaTag size={12} />;
    case "seasonal":
      return <FaGift size={12} />;
    case "annual":
      return <FaFire size={12} />;
  }
}

function getCategoryLabel(category: SalePeriod["category"]) {
  switch (category) {
    case "monthly":
      return "月例";
    case "seasonal":
      return "季節";
    case "annual":
      return "年間";
  }
}

/* ------------------------------------------------------------------ */
/*  Calendar Day Cell                                                  */
/* ------------------------------------------------------------------ */

function DayCell({
  year,
  month,
  day,
  isToday,
  onSelect,
  isSelected,
}: {
  year: number;
  month: number;
  day: number;
  isToday: boolean;
  onSelect: (day: number) => void;
  isSelected: boolean;
}) {
  const sales = getSalesForDate(year, month, day);
  const hasSale = sales.length > 0;

  return (
    <button
      onClick={() => onSelect(day)}
      className={`relative flex h-12 w-full flex-col items-center justify-center rounded-lg text-sm transition-all md:h-14 ${
        isSelected
          ? "ring-2 ring-[var(--color-primary)] bg-[var(--color-primary)]/10"
          : hasSale
          ? "bg-[var(--color-surface)] hover:bg-white/[0.05]"
          : "hover:bg-white/[0.02]"
      } ${isToday ? "font-bold text-[var(--color-primary)]" : "text-[var(--color-text-primary)]"}`}
    >
      <span>{day}</span>
      {hasSale && (
        <div className="mt-0.5 flex gap-0.5">
          {sales.slice(0, 3).map((sale, i) => (
            <span
              key={i}
              className="block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: sale.color }}
            />
          ))}
        </div>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Upcoming sales helper                                              */
/* ------------------------------------------------------------------ */

function getUpcomingSales(year: number, month: number): SalePeriod[] {
  const today = new Date();
  const currentDay = today.getDate();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  const allSales: SalePeriod[] = [];
  const m = month + 1;
  const daysInMonth = getDaysInMonth(year, month);

  for (const sale of MONTHLY_SALES) {
    const endDay = Math.min(sale.endDay, daysInMonth);
    const fullSale: SalePeriod = { ...sale, startMonth: m, endMonth: m };
    if (isCurrentMonth) {
      if (endDay >= currentDay) allSales.push(fullSale);
    } else {
      allSales.push(fullSale);
    }
  }

  for (const sale of [...SEASONAL_SALES, ...ANNUAL_SALES]) {
    if (sale.startMonth === sale.endMonth) {
      if (m === sale.startMonth) {
        if (isCurrentMonth) {
          if (sale.endDay >= currentDay) allSales.push(sale);
        } else {
          allSales.push(sale);
        }
      }
    } else {
      if (m === sale.startMonth || m === sale.endMonth) {
        allSales.push(sale);
      }
    }
  }

  return allSales;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function SalePredictPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(
    today.getDate()
  );

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);

  const selectedSales = useMemo(
    () =>
      selectedDay
        ? getSalesForDate(currentYear, currentMonth, selectedDay)
        : [],
    [currentYear, currentMonth, selectedDay]
  );

  const upcomingSales = useMemo(
    () => getUpcomingSales(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  };

  const isToday = (day: number) =>
    today.getFullYear() === currentYear &&
    today.getMonth() === currentMonth &&
    today.getDate() === day;

  return (
    <main className="content-shell px-4 py-6">
      <Breadcrumb items={[{ label: "セール予測カレンダー" }]} />

      {/* Hero */}
      <section className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-xs text-[var(--color-text-secondary)]">
            <FaCalendarAlt size={12} className="text-[var(--color-primary)]" />
            セール予測
          </div>
          <h1 className="gradient-text text-2xl font-black md:text-3xl">
            セール予測カレンダー
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-text-secondary)]">
            過去の傾向から予測したFANZAのセール時期をカレンダーで確認。
            お得な買い時を逃さず、賢くお買い物しよう。
          </p>
        </motion.div>
      </section>

      {/* Upcoming sales for this month */}
      {upcomingSales.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-6 p-5"
        >
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-[var(--color-text-primary)]">
            <FaChartBar className="text-[var(--color-primary)]" size={16} />
            {MONTH_NAMES[currentMonth]}のセール予測
          </h2>
          <div className="space-y-3">
            {upcomingSales.map((sale, i) => (
              <motion.div
                key={`${sale.name}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-xl bg-[var(--color-surface)] p-3"
              >
                <div
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: sale.color }}
                >
                  {getCategoryIcon(sale.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">
                      {sale.name}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                      style={{ backgroundColor: sale.color }}
                    >
                      {getCategoryLabel(sale.category)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--color-accent)]">
                    <FaPercentage className="mr-1 inline" size={9} />
                    {sale.discount}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                    {sale.strategy}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Calendar */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card mb-6 overflow-hidden"
      >
        {/* Month navigation */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
          <button
            onClick={goToPrevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:text-white"
          >
            <FaChevronLeft size={14} />
          </button>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            {currentYear}年{MONTH_NAMES[currentMonth]}
          </h2>
          <button
            onClick={goToNextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:text-white"
          >
            <FaChevronRight size={14} />
          </button>
        </div>

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 border-b border-[var(--color-border)]">
          {DAYS_OF_WEEK.map((d, i) => (
            <div
              key={d}
              className={`py-2 text-center text-[11px] font-medium ${
                i === 0
                  ? "text-red-400"
                  : i === 6
                  ? "text-blue-400"
                  : "text-[var(--color-text-muted)]"
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px p-2">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            return (
              <DayCell
                key={day}
                year={currentYear}
                month={currentMonth}
                day={day}
                isToday={isToday(day)}
                isSelected={selectedDay === day}
                onSelect={setSelectedDay}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 border-t border-[var(--color-border)] px-4 py-3">
          {[
            { label: "月例セール", color: "var(--color-primary)" },
            { label: "季節セール", color: "#f59e0b" },
            { label: "年間イベント", color: "#f97316" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)]"
            >
              <span
                className="block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </div>
          ))}
        </div>
      </motion.section>

      {/* Selected day detail */}
      <AnimatePresence mode="wait">
        {selectedDay && selectedSales.length > 0 && (
          <motion.section
            key={`detail-${selectedDay}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card mb-6 p-5"
          >
            <h3 className="mb-3 text-base font-bold text-[var(--color-text-primary)]">
              {currentMonth + 1}月{selectedDay}日のセール予測
            </h3>
            <div className="space-y-3">
              {selectedSales.map((sale, i) => (
                <div
                  key={i}
                  className="rounded-xl border-l-4 bg-[var(--color-surface)] p-4"
                  style={{ borderColor: sale.color }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">
                      {sale.name}
                    </span>
                    <span className="text-xs font-medium text-[var(--color-accent)]">
                      {sale.discount}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                    {sale.strategy}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Sale pattern stats */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card mb-6 p-5"
      >
        <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-[var(--color-text-primary)]">
          <FaChartBar className="text-[var(--color-accent)]" size={16} />
          セールパターン分析
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: <FaTag className="text-[var(--color-primary)]" size={20} />,
              label: "月例セール",
              desc: "毎月3回",
              detail: "月初（1〜3日）、月中（15〜17日）、月末（25日〜末日）",
            },
            {
              icon: <FaSun className="text-amber-400" size={20} />,
              label: "季節セール",
              desc: "年4回",
              detail: "GW、夏ボーナス、バレンタイン、年末年始",
            },
            {
              icon: <FaSnowflake className="text-blue-400" size={20} />,
              label: "年間イベント",
              desc: "年2回",
              detail: "FANZA周年記念（8月）、ブラックフライデー（11月）",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-[var(--color-surface)] p-4 text-center"
            >
              <div className="mb-2 flex justify-center">{item.icon}</div>
              <p className="text-sm font-bold text-[var(--color-text-primary)]">
                {item.label}
              </p>
              <p className="text-lg font-black text-[var(--color-primary)]">
                {item.desc}
              </p>
              <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Notification CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-[var(--color-primary)]/20 bg-gradient-to-r from-[var(--color-primary)]/8 to-[var(--color-accent)]/5 p-6 text-center"
      >
        <FaBell
          className="mx-auto mb-3 text-[var(--color-primary)]"
          size={28}
        />
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          セール通知を受け取る
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          セール開始時にいち早く情報をキャッチ。
          FANZAトクナビの最新情報をフォローしよう。
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a
            href="/sale"
            className="inline-block rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-80"
          >
            セール情報を見る
          </a>
          <a
            href="/weekly-sale"
            className="inline-block rounded-xl border border-[var(--color-border-strong)] px-6 py-2.5 text-sm font-bold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface)]"
          >
            週替わりセール
          </a>
        </div>
      </motion.section>
    </main>
  );
}
