"use client";

import { memo } from "react";
import { Mole } from "./Mole";

type GameBoardProps = {
  activeCell: number | null;
  isRunning: boolean;
  onHit: (cellIndex: number) => void;
  hitFeedbackIndex: number | null;
};

const CELLS = Array.from({ length: 9 });

const GameBoardComponent = ({
  activeCell,
  isRunning,
  onHit,
  hitFeedbackIndex,
}: GameBoardProps) => {
  return (
    <section className="w-full max-w-2xl">
      <div className="rounded-[40px] bg-white/40 p-6 shadow-badge backdrop-blur">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-emerald-900">
            モグラ叩きフィールド
          </h2>
          <span className="rounded-full bg-emerald-200/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-800">
            3 × 3
          </span>
        </header>

        <div className="meadow-grid grid aspect-square grid-cols-3 gap-4 rounded-[28px] p-4 shadow-inner">
          {CELLS.map((_, index) => {
            const isActive = activeCell === index;
            const isHit = hitFeedbackIndex === index;

            return (
              <button
                key={index}
                type="button"
                onClick={() => onHit(index)}
                disabled={!isRunning}
                className="hammer-cursor group relative flex aspect-square items-end justify-center overflow-hidden rounded-[26px] bg-gradient-to-br from-meadow-200 via-meadow-300 to-meadow-400 shadow-lg transition-transform duration-150 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={`穴 ${index + 1}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 via-transparent via-60% to-white/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <div className="absolute bottom-6 left-1/2 h-10 w-24 -translate-x-1/2 rounded-full bg-earth-600/80 blur-sm" />
                <div className="absolute bottom-4 left-1/2 h-8 w-[70%] -translate-x-1/2 rounded-full bg-earth-600 shadow-mound" />

                {isHit && (
                  <div
                    className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <div className="hit-pop relative flex h-28 w-28 items-center justify-center">
                      <span className="hit-pop__shockwave absolute inline-block rounded-full" />
                      <span className="hit-pop__burst hit-pop__burst--outer absolute h-full w-full rounded-full border-2 border-yellow-300/80" />
                      <span className="hit-pop__burst hit-pop__burst--inner absolute h-full w-full rotate-45 rounded-[28px] border-2 border-pink-400/70" />
                      <span className="hit-pop__spark absolute -top-5 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-yellow-300" />
                      <span className="hit-pop__spark hit-pop__spark--right absolute top-8 -right-3 h-4 w-4 rounded-full bg-orange-400" />
                      <span className="hit-pop__spark hit-pop__spark--left absolute top-6 -left-3 h-3 w-3 rounded-full bg-pink-400" />
                      <span className="hit-pop__spark hit-pop__spark--bottom absolute -bottom-4 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-amber-300" />
                      <span className="hit-pop__confetti hit-pop__confetti--one" />
                      <span className="hit-pop__confetti hit-pop__confetti--two" />
                      <span className="hit-pop__confetti hit-pop__confetti--three" />
                      <span className="hit-pop__confetti hit-pop__confetti--four" />
                      <span className="hit-pop__text relative -rotate-8 bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-3xl font-black uppercase text-transparent drop-shadow-[0_6px_12px_rgba(0,0,0,0.32)]">
                        ポコッ!
                      </span>
                    </div>
                  </div>
                )}

                <Mole isVisible={isActive} isHit={isHit} />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const GameBoard = memo(GameBoardComponent);
