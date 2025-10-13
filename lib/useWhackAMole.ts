import { useCallback, useEffect, useRef, useState } from "react";
import { pickNextDistinctIndex, randomBetween } from "./random";

const GRID_SIZE = 9;
const GAME_DURATION_SECONDS = 60;
const INITIAL_DELAY_RANGE = [300, 600] as const;
const APPEARANCE_INTERVAL_RANGE = [800, 1500] as const;
const VISIBLE_DURATION_RANGE = [450, 750] as const;
const RECENT_HIT_GRACE_MS = 240;

type TimerRef = ReturnType<typeof setTimeout> | null;
type IntervalRef = ReturnType<typeof setInterval> | null;

const useTimerRefs = () => {
  const gameTimerRef = useRef<IntervalRef>(null);
  const appearanceTimerRef = useRef<TimerRef>(null);
  const hideTimerRef = useRef<TimerRef>(null);
  const recentlyHiddenTimerRef = useRef<TimerRef>(null);

  const clearTimers = useCallback(() => {
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null;
    }
    if (appearanceTimerRef.current) {
      clearTimeout(appearanceTimerRef.current);
      appearanceTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (recentlyHiddenTimerRef.current) {
      clearTimeout(recentlyHiddenTimerRef.current);
      recentlyHiddenTimerRef.current = null;
    }
  }, []);

  return {
    gameTimerRef,
    appearanceTimerRef,
    hideTimerRef,
    recentlyHiddenTimerRef,
    clearTimers,
  };
};

export type UseWhackAMoleState = {
  isRunning: boolean;
  score: number;
  timeLeft: number;
  activeCell: number | null;
  startGame: () => void;
  stopGame: () => void;
  registerHit: (cellIndex: number) => boolean;
};

export const useWhackAMole = (): UseWhackAMoleState => {
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
  const [activeCell, setActiveCell] = useState<number | null>(null);

  const {
    gameTimerRef,
    appearanceTimerRef,
    hideTimerRef,
    recentlyHiddenTimerRef,
    clearTimers,
  } = useTimerRefs();

  const isRunningRef = useRef(false);
  const previousCellRef = useRef<number | null>(null);
  const activeCellRef = useRef<number | null>(null);
  const recentlyHiddenCellRef = useRef<number | null>(null);

  useEffect(() => {
    activeCellRef.current = activeCell;
  }, [activeCell]);

  const stopGame = useCallback(() => {
    clearTimers();
    isRunningRef.current = false;
    setIsRunning(false);
    setActiveCell(null);
    recentlyHiddenCellRef.current = null;
  }, [clearTimers]);

  const scheduleNextAppearance = useCallback(() => {
    if (!isRunningRef.current) {
      return;
    }

    const nextCell = pickNextDistinctIndex(GRID_SIZE, previousCellRef.current);
    previousCellRef.current = nextCell;
    setActiveCell(nextCell);

    const visibleDuration = randomBetween(
      VISIBLE_DURATION_RANGE[0],
      VISIBLE_DURATION_RANGE[1],
    );

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = setTimeout(() => {
      setActiveCell((current) => (current === nextCell ? null : current));
      recentlyHiddenCellRef.current = nextCell;
      if (recentlyHiddenTimerRef.current) {
        clearTimeout(recentlyHiddenTimerRef.current);
      }
      recentlyHiddenTimerRef.current = setTimeout(() => {
        recentlyHiddenCellRef.current = null;
        recentlyHiddenTimerRef.current = null;
      }, RECENT_HIT_GRACE_MS);
    }, visibleDuration);

    const nextInterval = randomBetween(
      APPEARANCE_INTERVAL_RANGE[0],
      APPEARANCE_INTERVAL_RANGE[1],
    );

    appearanceTimerRef.current = setTimeout(
      scheduleNextAppearance,
      nextInterval,
    );
  }, [appearanceTimerRef, hideTimerRef, recentlyHiddenTimerRef]);

  const startGame = useCallback(() => {
    clearTimers();
    setScore(0);
    setTimeLeft(GAME_DURATION_SECONDS);
    setActiveCell(null);
    previousCellRef.current = null;
    recentlyHiddenCellRef.current = null;

    setIsRunning(true);
    isRunningRef.current = true;

    const initialDelay = randomBetween(
      INITIAL_DELAY_RANGE[0],
      INITIAL_DELAY_RANGE[1],
    );

    appearanceTimerRef.current = setTimeout(
      scheduleNextAppearance,
      initialDelay,
    );

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          stopGame();
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  }, [
    appearanceTimerRef,
    clearTimers,
    gameTimerRef,
    scheduleNextAppearance,
    stopGame,
  ]);

  const registerHit = useCallback(
    (cellIndex: number) => {
      if (!isRunningRef.current) {
        return false;
      }

      const isDirectHit =
        activeCellRef.current !== null &&
        activeCellRef.current === cellIndex;
      const isGraceHit = recentlyHiddenCellRef.current === cellIndex;

      if (!isDirectHit && !isGraceHit) {
        return false;
      }

      setScore((current) => current + 1);
      setActiveCell(null);
      recentlyHiddenCellRef.current = null;

      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      if (recentlyHiddenTimerRef.current) {
        clearTimeout(recentlyHiddenTimerRef.current);
        recentlyHiddenTimerRef.current = null;
      }

      return true;
    },
    [hideTimerRef, recentlyHiddenTimerRef],
  );

  useEffect(() => {
    return () => {
      clearTimers();
      recentlyHiddenCellRef.current = null;
    };
  }, [clearTimers]);

  return {
    isRunning,
    score,
    timeLeft,
    activeCell,
    startGame,
    stopGame,
    registerHit,
  };
};
