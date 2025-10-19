"use client";

import { memo } from "react";

type ControlPanelProps = {
  score: number;
  timeLeft: number;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  scoreHighlight: boolean;
};

const formatTime = (seconds: number) => {
  const clamped = Math.max(0, seconds);
  const m = String(Math.floor(clamped / 60)).padStart(2, "0");
  const s = String(clamped % 60).padStart(2, "0");
  return `${m}:${s}`;
};

const ControlPanelComponent = ({
  score,
  timeLeft,
  isRunning,
  onStart,
  onStop,
  scoreHighlight,
}: ControlPanelProps) => {
  const isGameOver = !isRunning && timeLeft === 0;
  const buttonLabel = isRunning
    ? "ストップ"
    : isGameOver
      ? "もう一回！"
      : "スタート";

  return (
    <section className="w-full max-w-md">
      <div className="flex flex-col gap-4 rounded-3xl bg-white/85 p-6 shadow-badge backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="relative flex flex-col gap-1">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              SCORE
            </span>
            <span
              className="score-burst relative text-5xl font-bold text-emerald-900"
              data-active={scoreHighlight || isGameOver}
            >
              {score}
            </span>
            <span className="text-xs text-emerald-700">
              叩いたモグラの数
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              TIME
            </span>
            <span className="text-4xl font-bold text-emerald-900 tabular-nums">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs text-emerald-700">
              持ち時間は60秒
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={isRunning ? onStop : onStart}
          className="group relative mt-2 flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-lg font-bold text-white shadow-lg transition-transform duration-150 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-200"
        >
          <span className="absolute inset-0 bg-white/15 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          <span className="relative z-10">{buttonLabel}</span>
        </button>

        <p className="rounded-2xl bg-emerald-100/70 p-3 text-sm text-emerald-800">
          {isGameOver
            ? "ナイスファイト！スコア更新、目指してみる？"
            : "ランダムに飛び出すモグラをタップしてスコアを伸ばそう。"}
        </p>
      </div>
    </section>
  );
};

export const ControlPanel = memo(ControlPanelComponent);
