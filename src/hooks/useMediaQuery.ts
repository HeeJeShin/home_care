"use client";

import { useState, useEffect } from "react";

/**
 * CSS 미디어 쿼리 매칭을 감지하는 훅.
 * @param query 미디어 쿼리 문자열 (예: "(min-width: 768px)")
 * @returns 쿼리 매칭 여부
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
};

/** 모바일 뷰포트 감지 (< 640px) */
export const useIsMobile = (): boolean => useMediaQuery("(max-width: 639px)");

/** 태블릿 뷰포트 감지 (640px - 1023px) */
export const useIsTablet = (): boolean =>
  useMediaQuery("(min-width: 640px) and (max-width: 1023px)");

/** 데스크톱 뷰포트 감지 (>= 1024px) */
export const useIsDesktop = (): boolean => useMediaQuery("(min-width: 1024px)");
