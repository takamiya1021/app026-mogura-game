import { useCallback, useEffect, useRef, useState } from "react";
import { pickNextDistinctIndex, randomBetween } from "./random";

const GRID_SIZE = 9;
const GAME_DURATION_SECONDS = 60;
const INITIAL_DELAY_RANGE = [300, 600] as const;
const APPEARANCE_INTERVAL_RANGE = [800, 1500] as const;
const VISIBLE_DURATION_RANGE = [450, 750] as const;

type TimerRef = ReturnType<typeof setTimeout> | null;
type IntervalRef = ReturnType<typeof setInterval> | null;

const useTimerRefs = () => {
  const gameTimerRef = useRef<IntervalRef>(null);
  const appearanceTimerRef = useRef<TimerRef>(null);
  const hideTimerRef = useRef<TimerRef>(null);

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
  }, []);

  return {
    gameTimerRef,
    appearanceTimerRef,
    hideTimerRef,
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

  const { gameTimerRef, appearanceTimerRef, hideTimerRef, clearTimers } =
    useTimerRefs();

  const isRunningRef = useRef(false);
  const previousCellRef = useRef<number | null>(null);
  const activeCellRef = useRef<number | null>(null);

  useEffect(() => {
    activeCellRef.current = activeCell;
  }, [activeCell]);

  const stopGame = useCallback(() => {
    clearTimers();
    isRunningRef.current = false;
    setIsRunning(false);
    setActiveCell(null);
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
    }, visibleDuration);

    const nextInterval = randomBetween(
      APPEARANCE_INTERVAL_RANGE[0],
      APPEARANCE_INTERVAL_RANGE[1],
    );

    appearanceTimerRef.current = setTimeout(
      scheduleNextAppearance,
      nextInterval,
    );
  }, [appearanceTimerRef, hideTimerRef]);

  const startGame = useCallback(() => {
    clearTimers();
    setScore(0);
    setTimeLeft(GAME_DURATION_SECONDS);
    setActiveCell(null);
    previousCellRef.current = null;

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
      if (
        !isRunningRef.current ||
        activeCellRef.current === null ||
        activeCellRef.current !== cellIndex
      ) {
        return false;
      }

      setScore((current) => current + 1);
      setActiveCell(null);

      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }

      return true;
    },
    [hideTimerRef],
  );

  useEffect(() => {
    return () => {
      clearTimers();
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

