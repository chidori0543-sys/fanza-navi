"use client";

import { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";

/**
 * 次回データ更新までのカウントダウン。
 * 実際のcronスケジュール（毎日9:00 JST）に基づく正確な表示。
 */
export default function CountdownTimer() {
  const target = getNextUpdateTime();
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft(target));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(getNextUpdateTime()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <FaClock className="text-[var(--color-primary)]" />
      <span className="text-sm text-[var(--color-text-secondary)]">
        次回データ更新まで
      </span>
      <div className="flex gap-1.5">
        <TimeUnit value={timeLeft.hours} unit="時間" />
        <span className="text-[var(--color-primary)] font-bold self-center">:</span>
        <TimeUnit value={timeLeft.minutes} unit="分" />
        <span className="text-[var(--color-primary)] font-bold self-center">:</span>
        <TimeUnit value={timeLeft.seconds} unit="秒" />
      </div>
    </div>
  );
}

function TimeUnit({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg px-2.5 py-1 font-mono text-lg font-bold text-white min-w-[2.5rem] text-center">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
        {unit}
      </span>
    </div>
  );
}

/** 次の9:00 JST (= 0:00 UTC) を返す */
function getNextUpdateTime(): Date {
  const now = new Date();
  const utcToday9amJST = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0, 0, 0, 0
  ));
  if (now.getTime() >= utcToday9amJST.getTime()) {
    utcToday9amJST.setUTCDate(utcToday9amJST.getUTCDate() + 1);
  }
  return utcToday9amJST;
}

function calcTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
