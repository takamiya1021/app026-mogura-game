"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ControlPanel } from "@/components/ControlPanel";
import { GameBoard } from "@/components/GameBoard";
import { useWhackAMole } from "@/lib/useWhackAMole";

const HIT_FEEDBACK_MS = 720;

export default function Page() {
  const { isRunning, score, timeLeft, activeCell, startGame, registerHit } =
    useWhackAMole();

  const [hitFeedbackIndex, setHitFeedbackIndex] = useState<number | null>(null);
  const [scoreHighlight, setScoreHighlight] = useState(false);
  const scoreHighlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleStart = useCallback(() => {
    setHitFeedbackIndex(null);
    setScoreHighlight(false);
    startGame();
  }, [startGame]);

  const handleHit = useCallback(
    (cellIndex: number) => {
      const wasHit = registerHit(cellIndex);
      if (wasHit) {
        setHitFeedbackIndex(cellIndex);
        setScoreHighlight(true);

        if (scoreHighlightTimeoutRef.current) {
          clearTimeout(scoreHighlightTimeoutRef.current);
          scoreHighlightTimeoutRef.current = null;
        }

        scoreHighlightTimeoutRef.current = setTimeout(() => {
          setScoreHighlight(false);
          scoreHighlightTimeoutRef.current = null;
        }, HIT_FEEDBACK_MS + 80);
      }
    },
    [registerHit],
  );

  useEffect(() => {
    if (hitFeedbackIndex === null) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setHitFeedbackIndex((current) =>
        current === hitFeedbackIndex ? null : current,
      );
    }, HIT_FEEDBACK_MS);

    return () => clearTimeout(timeout);
  }, [hitFeedbackIndex]);

  useEffect(() => {
    if (!isRunning) {
      setHitFeedbackIndex(null);
      setScoreHighlight(false);
    }
  }, [isRunning]);

  useEffect(() => {
    return () => {
      if (scoreHighlightTimeoutRef.current) {
        clearTimeout(scoreHighlightTimeoutRef.current);
        scoreHighlightTimeoutRef.current = null;
      }
    };
  }, []);

  const statusLabel = useMemo(() => {
    if (isRunning) {
      if (timeLeft <= 10) {
        return "ラストスパート！急いで叩け！";
      }
      return "モグラはどこや？落ち着いて狙うで。";
    }
    if (timeLeft === 0) {
      return "おつかれさま！スコア更新を狙って再挑戦しよ。";
    }
    return "スタートボタンを押してモグラ退治を始めよう！";
  }, [isRunning, timeLeft]);

  const isGameOver = !isRunning && timeLeft === 0;

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-10 px-6 py-12 sm:gap-12 sm:py-16">
      <header className="flex flex-col items-center gap-2 text-center text-emerald-950">
        <p className="rounded-full bg-white/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.45em] text-emerald-700 shadow-sm">
          WHACK · A · MOLE
        </p>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          60秒の草原バトル、モグラ叩きへようこそ！
        </h1>
        <p className="max-w-2xl text-base text-emerald-900/80 sm:text-lg">
          リズムよくタップしてモグラをやっつけよう。3×3の穴からランダムにこんにちは。
          反射神経と集中力の勝負やで！
        </p>
      </header>

      <ControlPanel
        score={score}
        timeLeft={timeLeft}
        isRunning={isRunning}
        onStart={handleStart}
        scoreHighlight={scoreHighlight}
      />

      <GameBoard
        activeCell={activeCell}
        isRunning={isRunning}
        onHit={handleHit}
        hitFeedbackIndex={hitFeedbackIndex}
      />

      <footer className="w-full max-w-md rounded-3xl bg-white/70 p-5 text-center text-sm text-emerald-900 shadow-badge">
        <p>{statusLabel}</p>
        {isGameOver && (
          <p className="mt-2 text-xs text-emerald-700">
            ベストスコアをメモして、自己ベストを塗り替えていこう！
          </p>
        )}
      </footer>
    </main>
  );
}
