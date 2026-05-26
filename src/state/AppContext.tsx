"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { TOTAL_HOURS } from "@/lib/constants";
import { fmtKDateTime, fmtKShort, fmtHM } from "@/lib/format";
import type {
  AlarmTimes,
  AlertEvent,
  AlertType,
  AppMode,
  Check,
  CheckDraft,
  CheckStep,
  Patient,
  QRData,
  Route,
  SetupStep,
  AlarmSlot,
} from "@/types";

/** 데모용: 27시간 전에 주입 시작 (중간 상태) */
const demoStart = (): Date => {
  const d = new Date();
  d.setHours(d.getHours() - 27);
  d.setMinutes(0, 0, 0);
  return d;
};

/** 시간 문자열을 분으로 변환 */
const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** 슬롯 판별 */
const resolveSlot = (now: Date, alarms: AlarmTimes): AlarmSlot => {
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const morningMins = toMinutes(alarms.morning);
  const noonMins = toMinutes(alarms.noon);
  const eveningMins = toMinutes(alarms.evening);

  if (nowMins < noonMins) return "morning";
  if (nowMins < eveningMins) return "noon";
  return "evening";
};

/** 다음 알람 슬롯 계산 */
const getNextAlarmSlot = (now: Date, alarms: AlarmTimes): AlarmSlot => {
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const slots = [
    { slot: "morning" as const, mins: toMinutes(alarms.morning) },
    { slot: "noon" as const, mins: toMinutes(alarms.noon) },
    { slot: "evening" as const, mins: toMinutes(alarms.evening) },
  ].sort((a, b) => a.mins - b.mins);

  for (const { slot, mins } of slots) {
    if (nowMins < mins) return slot;
  }
  // 오늘 알람 모두 지남 → 내일 첫 알람
  return slots[0].slot;
};

/** 슬롯 라벨 */
const SLOT_LABELS: Record<AlarmSlot, string> = {
  morning: "아침",
  noon: "점심",
  evening: "저녁",
  adhoc: "수시",
};

/** 데모 점검 데이터 */
const buildDemoChecks = (startAt: Date, alarms: AlarmTimes): Check[] => {
  const at = (h: number, m = 0): string => {
    const d = new Date(startAt);
    d.setHours(startAt.getHours() + h, m);
    return d.toISOString();
  };
  return [
    { id: "1", at: at(2, 30), slot: "adhoc", scaleMl: 118, locks: [true, true], tempOk: true, ok: true, note: "시작 직후" },
    { id: "2", at: at(7, 15), slot: "morning", scaleMl: 105, locks: [true, true], tempOk: true, ok: true },
    { id: "3", at: at(13, 5), slot: "noon", scaleMl: 85, locks: [true, true], tempOk: true, ok: true, note: "아침 식사 후" },
    { id: "4", at: at(19, 0), slot: "evening", scaleMl: 65, locks: [true, true], tempOk: true, ok: true },
    { id: "5", at: at(24, 40), slot: "morning", scaleMl: 50, locks: [true, true], tempOk: true, ok: true },
  ];
};

export type AppState = {
  // 앱 모드
  mode: AppMode;
  setMode: (m: AppMode) => void;

  // 라우팅
  route: Route;
  setRoute: (r: Route) => void;
  goTo: (r: Route) => void;

  // 의료진 설정 스텝
  setupStep: SetupStep;
  setSetupStep: (s: SetupStep) => void;

  // 점검 플로우 스텝
  checkStep: CheckStep;
  setCheckStep: (s: CheckStep) => void;

  // 이상 상황 타입
  alertType: AlertType | null;
  setAlertType: (a: AlertType | null) => void;

  // 환자 정보
  patient: Patient;
  setPatient: (p: Patient) => void;

  // 일정
  startAt: Date;
  setStartAt: (d: Date) => void;
  endAt: Date;
  alarmTimes: AlarmTimes;
  setAlarmTimes: (a: AlarmTimes) => void;

  // 설정
  staffLocked: boolean;
  setStaffLocked: (l: boolean) => void;

  // 점검 기록
  checks: Check[];
  setChecks: (updater: Check[] | ((c: Check[]) => Check[])) => void;
  addCheck: (check: Check) => void;

  // 이상 이벤트
  alerts: AlertEvent[];
  addAlert: (alert: AlertEvent) => void;

  // 점검 임시 데이터
  draft: CheckDraft;
  setDraft: (d: CheckDraft) => void;

  // 계산된 값
  now: Date;
  progress: number;
  remH: number;
  remM: number;
  elH: number;
  totalHours: number;
  nextAlarm: Date;
  nextAlarmSlot: AlarmSlot;
  nextAlarmLabel: string;
  streak: number;
  currentScale: number;

  // 액션
  startCheck: () => void;
  submitCheck: (ok?: boolean) => void;

  // QR 관련
  generateQRData: () => string;
  loadFromQRData: (encoded: string) => boolean;
  resetToAdmin: (pin: string) => boolean;

  // 포맷터
  fmtKDateTime: (d: Date) => string;
  fmtKShort: (d: Date) => string;
  fmtHM: (d: Date) => string;
};

const AppCtx = createContext<AppState | null>(null);

export const useApp = (): AppState => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
};

type AppProviderProps = {
  children: ReactNode;
};

/** 관리자 PIN (환자 모드에서 관리자 모드로 전환 시 필요) */
const ADMIN_PIN = "1234";

export const AppProvider = ({ children }: AppProviderProps): ReactNode => {
  // 앱 모드
  const [mode, setMode] = useState<AppMode>("admin");

  // 라우팅
  const [route, setRoute] = useState<Route>("setup");
  const [setupStep, setSetupStep] = useState<SetupStep>("patient");
  const [checkStep, setCheckStep] = useState<CheckStep>(0);
  const [alertType, setAlertType] = useState<AlertType | null>(null);

  // 환자 정보 (의료진이 퇴원 전 입력) - 빈 값으로 시작
  const [patient, setPatient] = useState<Patient>({
    name: "",
    age: null,
    gender: null,
    mrn: "",
    birth: "",
    regimen: null,
    round: "",
    linkedHospital: "",
    doctor: "",
    nurse: "",
    wardPhone: "",
  });

  // 일정 - 빈 상태로 시작
  const [startAt, setStartAt] = useState<Date>(() => new Date());
  const [alarmTimes, setAlarmTimes] = useState<AlarmTimes>({
    morning: "08:00",
    noon: "13:00",
    evening: "19:00",
  });

  // 설정
  const [staffLocked, setStaffLocked] = useState(false);

  // 점검 기록 - 빈 배열로 시작
  const [checks, setChecks] = useState<Check[]>([]);

  // 이상 이벤트
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);

  // 점검 임시 데이터
  const [draft, setDraft] = useState<CheckDraft>({
    scaleMl: 120,
    locks: [null, null],
    tempOk: null,
    note: "",
    photo: false,
  });

  // 계산된 값
  const endAt = useMemo(() => {
    const d = new Date(startAt);
    d.setHours(d.getHours() + TOTAL_HOURS);
    return d;
  }, [startAt]);

  const [now, setNow] = useState(() => new Date());

  // now를 1분마다 업데이트
  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 60000); // 1분
    return () => clearInterval(id);
  }, []);
  const totalMs = TOTAL_HOURS * 3600 * 1000;
  const elapsedMs = now.getTime() - startAt.getTime();
  const progress = Math.max(0, Math.min(1, elapsedMs / totalMs));
  const remainingMs = Math.max(0, totalMs - elapsedMs);
  const remH = Math.floor(remainingMs / 3600000);
  const remM = Math.floor((remainingMs % 3600000) / 60000);
  const elH = Math.floor(elapsedMs / 3600000);

  const nextAlarm = useMemo(() => {
    const times = Object.values(alarmTimes).sort();
    const d = new Date(now);
    for (const t of times) {
      const [hh, mm] = t.split(":").map(Number);
      const nd = new Date(d);
      nd.setHours(hh, mm, 0, 0);
      if (nd > d) return nd;
    }
    const [hh, mm] = times[0].split(":").map(Number);
    const nd = new Date(d);
    nd.setDate(d.getDate() + 1);
    nd.setHours(hh, mm, 0, 0);
    return nd;
  }, [alarmTimes, now]);

  const nextAlarmSlot = useMemo(() => getNextAlarmSlot(now, alarmTimes), [now, alarmTimes]);
  const nextAlarmLabel = SLOT_LABELS[nextAlarmSlot];

  const streak = checks.filter((c) => c.ok).length;
  const currentScale = checks.at(-1)?.scaleMl ?? 120;

  // 액션
  const goTo = useCallback((r: Route): void => setRoute(r), []);

  const addCheck = useCallback((check: Check): void => {
    setChecks((arr) => [...arr, check]);
  }, []);

  const addAlert = useCallback((alert: AlertEvent): void => {
    setAlerts((arr) => [...arr, alert]);
  }, []);

  const startCheck = useCallback((): void => {
    setCheckStep(0);
    const last = checks.at(-1);
    setDraft({
      scaleMl: Math.max(0, last ? last.scaleMl - 5 : 38),
      locks: [null, null],
      tempOk: null,
      note: "",
      photo: false,
    });
    setRoute("check");
  }, [checks]);

  const submitCheck = useCallback((ok = true): void => {
    const check: Check = {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      slot: resolveSlot(new Date(), alarmTimes),
      scaleMl: draft.scaleMl,
      locks: draft.locks as [boolean, boolean],
      tempOk: draft.tempOk ?? false,
      ok,
      note: draft.note || undefined,
    };
    addCheck(check);
  }, [draft, alarmTimes, addCheck]);

  // QR 데이터 생성 (base64 인코딩)
  const generateQRData = useCallback((): string => {
    const data: QRData = {
      patient,
      startAt: startAt.toISOString(),
      alarmTimes,
    };
    const json = JSON.stringify(data);
    return btoa(encodeURIComponent(json));
  }, [patient, startAt, alarmTimes]);

  // QR 데이터에서 상태 로드
  const loadFromQRData = useCallback((encoded: string): boolean => {
    try {
      const json = decodeURIComponent(atob(encoded));
      const data = JSON.parse(json) as QRData;
      setPatient(data.patient);
      setStartAt(new Date(data.startAt));
      setAlarmTimes(data.alarmTimes);
      setMode("patient");
      setStaffLocked(true);
      setRoute("intro");
      setChecks([]);
      return true;
    } catch {
      return false;
    }
  }, []);

  // 관리자 모드로 복귀 (PIN 확인)
  const resetToAdmin = useCallback((pin: string): boolean => {
    if (pin === ADMIN_PIN) {
      setMode("admin");
      setStaffLocked(false);
      setRoute("setup");
      setSetupStep("patient");
      return true;
    }
    return false;
  }, []);

  // URL 쿼리스트링에서 QR 데이터 로드 (최초 마운트 시)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("d");
    if (encoded) {
      const success = loadFromQRData(encoded);
      if (success) {
        // URL에서 쿼리스트링 제거 (히스토리 교체)
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [loadFromQRData]);

  const value: AppState = {
    mode,
    setMode,
    route,
    setRoute,
    goTo,
    setupStep,
    setSetupStep,
    checkStep,
    setCheckStep,
    alertType,
    setAlertType,
    patient,
    setPatient,
    startAt,
    setStartAt,
    endAt,
    alarmTimes,
    setAlarmTimes,
    staffLocked,
    setStaffLocked,
    checks,
    setChecks,
    addCheck,
    alerts,
    addAlert,
    draft,
    setDraft,
    now,
    progress,
    remH,
    remM,
    elH,
    totalHours: TOTAL_HOURS,
    nextAlarm,
    nextAlarmSlot,
    nextAlarmLabel,
    streak,
    currentScale,
    startCheck,
    submitCheck,
    generateQRData,
    loadFromQRData,
    resetToAdmin,
    fmtKDateTime,
    fmtKShort,
    fmtHM,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
};
