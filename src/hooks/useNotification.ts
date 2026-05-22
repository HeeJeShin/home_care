"use client";

import { useState, useEffect, useCallback } from "react";

export type NotificationPermission = "default" | "granted" | "denied";

export type NotificationResult = {
  /** 현재 권한 상태 */
  permission: NotificationPermission;
  /** 권한 요청 가능 여부 */
  isSupported: boolean;
  /** 권한 요청 함수 */
  requestPermission: () => Promise<NotificationPermission>;
  /** 알림 표시 함수 */
  showNotification: (title: string, options?: NotificationOptions) => void;
};

/**
 * 브라우저 알림 권한 및 표시를 관리하는 훅.
 */
export const useNotification = (): NotificationResult => {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    setPermission(Notification.permission as NotificationPermission);
  }, []);

  const requestPermission =
    useCallback(async (): Promise<NotificationPermission> => {
      if (!isSupported) return "denied";

      try {
        const result = await Notification.requestPermission();
        setPermission(result as NotificationPermission);
        return result as NotificationPermission;
      } catch {
        return "denied";
      }
    }, [isSupported]);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions): void => {
      if (!isSupported || permission !== "granted") return;

      try {
        new Notification(title, {
          icon: "/icon.png",
          badge: "/icon.png",
          ...options,
        });
      } catch (error) {
        console.warn("알림 표시 실패:", error);
      }
    },
    [isSupported, permission]
  );

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
  };
};
