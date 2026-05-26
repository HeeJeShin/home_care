"use client";

import { useEffect, useRef } from "react";
import type { AlarmTimes, AlarmSlot } from "@/types";

const SLOT_LABELS: Record<AlarmSlot, string> = {
  morning: "아침",
  noon: "점심",
  evening: "저녁",
  adhoc: "수시",
};

type UseAlarmSchedulerOptions = {
  alarmTimes: AlarmTimes;
  enabled: boolean;
  onAlarm?: (slot: AlarmSlot) => void;
};

/**
 * 알람 시간에 자동으로 Notification을 발송하는 스케줄러 훅.
 * 1분마다 현재 시간을 확인하고, 알람 시간에 도달하면 알림을 발송합니다.
 */
export const useAlarmScheduler = ({
  alarmTimes,
  enabled,
  onAlarm,
}: UseAlarmSchedulerOptions): void => {
  // 마지막으로 알람을 발송한 슬롯 (중복 방지)
  const lastFiredSlot = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const checkAlarm = (): void => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${hh}:${mm}`;
      const today = now.toDateString();

      // 각 알람 시간 확인
      const slots: { slot: AlarmSlot; time: string }[] = [
        { slot: "morning", time: alarmTimes.morning },
        { slot: "noon", time: alarmTimes.noon },
        { slot: "evening", time: alarmTimes.evening },
      ];

      for (const { slot, time } of slots) {
        // 알람 시간과 현재 시간이 일치하고, 오늘 아직 발송하지 않았으면
        if (currentTime === time && lastFiredSlot.current !== `${today}-${slot}`) {
          lastFiredSlot.current = `${today}-${slot}`;

          // Notification 발송
          try {
            const n = new Notification(`${SLOT_LABELS[slot]} 점검 시간이에요`, {
              body: "지금 홈펌프 상태를 확인해주세요",
              icon: "/icon.png",
              tag: `homecare-${slot}`,
              requireInteraction: true,
            });

            n.onclick = (): void => {
              window.focus();
              n.close();
            };

            onAlarm?.(slot);
          } catch (error) {
            console.warn("알림 발송 실패:", error);
          }
        }
      }
    };

    // 즉시 확인
    checkAlarm();

    // 1분마다 확인
    const id = setInterval(checkAlarm, 60000);

    return () => clearInterval(id);
  }, [alarmTimes, enabled, onAlarm]);
};
