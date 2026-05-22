"use client";

import { useEffect, useRef } from "react";

/**
 * setInterval을 React-safe하게 사용하기 위한 훅.
 * @param callback 콜백 함수
 * @param delay 지연 시간 (ms). null이면 정지.
 */
export const useInterval = (
  callback: () => void,
  delay: number | null
): void => {
  const savedCallback = useRef<() => void>(callback);

  // 콜백이 변경되면 ref 업데이트
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 인터벌 설정
  useEffect(() => {
    if (delay === null) return;

    const tick = (): void => {
      savedCallback.current();
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
};
