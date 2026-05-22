"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

export type CountdownResult = {
  /** 남은 총 밀리초 */
  remaining: number;
  /** 남은 시간 */
  hours: number;
  /** 남은 분 */
  minutes: number;
  /** 남은 초 */
  seconds: number;
  /** 타이머 완료 여부 */
  isComplete: boolean;
  /** "4시간 25분" 형태의 포맷 문자열 */
  formatted: string;
  /** 리셋 함수 */
  reset: (newTarget?: Date) => void;
};

/**
 * 타깃 시간까지 남은 시간을 계산하는 카운트다운 훅.
 * @param targetDate 타깃 시간
 * @param intervalMs 업데이트 주기 (기본 1000ms)
 */
export const useCountdown = (
  targetDate: Date | null,
  intervalMs = 1000
): CountdownResult => {
  const [target, setTarget] = useState<Date | null>(targetDate);

  const calculateRemaining = useCallback((): number => {
    if (!target) return 0;
    const diff = target.getTime() - Date.now();
    return Math.max(0, diff);
  }, [target]);

  const [remaining, setRemaining] = useState<number>(calculateRemaining);

  useEffect(() => {
    setTarget(targetDate);
  }, [targetDate]);

  useEffect(() => {
    if (!target) {
      setRemaining(0);
      return;
    }

    setRemaining(calculateRemaining());

    const id = setInterval(() => {
      const newRemaining = calculateRemaining();
      setRemaining(newRemaining);

      if (newRemaining <= 0) {
        clearInterval(id);
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [target, intervalMs, calculateRemaining]);

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const isComplete = remaining <= 0;

  const formatted = useMemo(() => {
    if (isComplete) return "완료";
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    if (minutes > 0) {
      return `${minutes}분 ${seconds}초`;
    }
    return `${seconds}초`;
  }, [hours, minutes, seconds, isComplete]);

  const reset = useCallback((newTarget?: Date): void => {
    if (newTarget) {
      setTarget(newTarget);
    } else {
      setRemaining(calculateRemaining());
    }
  }, [calculateRemaining]);

  return {
    remaining,
    hours,
    minutes,
    seconds,
    isComplete,
    formatted,
    reset,
  };
};
