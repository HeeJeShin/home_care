"use client";

import { useState, useEffect, useCallback } from "react";

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

/**
 * 로컬 스토리지에 값을 영속화하는 훅.
 * SSR 환경에서는 초기값을 사용하고, 클라이언트에서 hydrate.
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, SetValue<T>, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // 클라이언트에서만 로컬 스토리지 읽기
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`useLocalStorage: Error reading key "${key}"`, error);
    }
    setIsHydrated(true);
  }, [key]);

  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`useLocalStorage: Error setting key "${key}"`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback((): void => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`useLocalStorage: Error removing key "${key}"`, error);
    }
  }, [key, initialValue]);

  return [isHydrated ? storedValue : initialValue, setValue, removeValue];
};
